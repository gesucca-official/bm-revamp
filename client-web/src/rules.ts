// Minimal reader for docs/game-rules.md (D10: the client imports the source at build time, no third copy).
// Only the subset the rules use: headings, paragraphs, ordered and unordered lists, tables, **bold**, *italic*
// and `code`. The output is plain data rendered as React text: raw HTML stays text, and links or anchors
// become their label only, so nothing in the document can navigate or inject markup.

export type Inline = {kind: 'text' | 'code'; text: string} | {kind: 'strong' | 'em'; children: Inline[]};
export type Block =
  | {kind: 'heading'; level: number; text: string}
  | {kind: 'paragraph'; inlines: Inline[]}
  | {kind: 'list'; ordered: boolean; items: Inline[][]}
  | {kind: 'table'; head: Inline[][]; align: ('left' | 'right' | 'center')[]; rows: Inline[][][]};

/** Inline markup to data; [label](target) keeps only the label. */
export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let text = '';
  const flush = () => { if (text) { out.push({kind: 'text', text}); text = ''; } };
  for (let i = 0; i < source.length;) {
    const rest = source.slice(i);
    const code = /^`([^`]+)`/.exec(rest);
    if (code) { flush(); out.push({kind: 'code', text: code[1]}); i += code[0].length; continue; }
    const strong = /^\*\*(?=\S)([\s\S]*?\S)\*\*/.exec(rest);
    if (strong) { flush(); out.push({kind: 'strong', children: parseInline(strong[1])}); i += strong[0].length; continue; }
    const em = /^\*(?=[^\s*])([^*]*?[^\s*])\*/.exec(rest);
    if (em) { flush(); out.push({kind: 'em', children: parseInline(em[1])}); i += em[0].length; continue; }
    const link = /^!?\[([^\]]*)\]\([^)]*\)/.exec(rest);
    if (link) { flush(); out.push(...parseInline(link[1])); i += link[0].length; continue; }
    text += source[i++];
  }
  flush();
  // A link label joins the text around it.
  return out.reduce<Inline[]>((all, i) => { const last = all.at(-1); if (i.kind === 'text' && last?.kind === 'text') all[all.length - 1] = {kind: 'text', text: last.text + i.text}; else all.push(i); return all; }, []);
}

const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
const separator = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const bullet = /^- (.*)$/, number = /^\d+\. (.*)$/;

export function parseRules(markdown: string): Block[] {
  const lines = markdown.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const close = () => { if (paragraph.length) { blocks.push({kind: 'paragraph', inlines: parseInline(paragraph.join(' '))}); paragraph = []; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { close(); continue; }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) { close(); blocks.push({kind: 'heading', level: heading[1].length, text: heading[2].trim()}); continue; }
    if (line.startsWith('|') && separator.test(lines[i + 1] ?? '')) {
      close();
      const align = cells(lines[i + 1]).map(c => c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : 'left') as ('left' | 'right' | 'center')[];
      const head = cells(line).map(parseInline), rows: Inline[][][] = [];
      for (i += 2; i < lines.length && lines[i].startsWith('|'); i++) rows.push(cells(lines[i]).map(parseInline));
      i--;
      blocks.push({kind: 'table', head, align, rows});
      continue;
    }
    const item = bullet.exec(line) ?? number.exec(line);
    if (item) {
      close();
      const ordered = !bullet.test(line), last = blocks.at(-1);
      // Items separated by blank lines (the revision list) stay in one list.
      if (last?.kind === 'list' && last.ordered === ordered) last.items.push(parseInline(item[1]));
      else blocks.push({kind: 'list', ordered, items: [parseInline(item[1])]});
      continue;
    }
    paragraph.push(line.trim());
  }
  close();
  return blocks;
}

/** Plain text of inline data (search, checks and accessible labels). */
export const plain = (inlines: Inline[]): string => inlines.map(i => 'children' in i ? plain(i.children) : i.text).join('');

/** "1.8" from "Versione **1.8 — 28 ottobre 2026**". */
export const rulesVersion = (blocks: Block[]) => {
  for (const b of blocks) if (b.kind === 'paragraph') { const m = /^Versione (\d+(?:\.\d+)*)/.exec(plain(b.inlines)); if (m) return m[1]; }
  return null;
};
