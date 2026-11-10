package com.gsc.bm.service.session;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import static com.gsc.bm.repo.external.MatchEventRepository.sha256;

/** Identifies the actual loaded artifact/classes, rules, set documents (regulation 1.13) and catalog, including dirty builds. */
@Component
public class MatchVersions {
    /** SB-8: what identifies a set draft played by the development server (profile {@code bozza}); absent in live matches. */
    public interface DraftIdentity { Map<String, Object> describe(); }

    private final Map<String, Object> versions;
    public MatchVersions() { this((DraftIdentity) null); }
    @Autowired
    public MatchVersions(ObjectProvider<DraftIdentity> draft) { this(draft.getIfAvailable()); }
    private MatchVersions(DraftIdentity draft) {
        try {
            byte[] rules = resource("analysis/game-rules.md");
            String rulesText = new String(rules, StandardCharsets.UTF_8).replace("\r\n", "\n");
            var version = java.util.regex.Pattern.compile("Versione \\*\\*([0-9.]+) —").matcher(rulesText);
            if (!version.find()) { throw new IllegalStateException("Missing rules version"); }
            java.net.URL source = MatchVersions.class.getProtectionDomain().getCodeSource().getLocation();
            // Boot may expose BOOT-INF/classes through a nested jar URL.
            while (source.getProtocol().equals("jar")) { source = org.springframework.util.ResourceUtils.extractJarFileURL(source); }
            Path location = Path.of(source.toURI());
            String code;
            if (Files.isDirectory(location)) {
                var digest = java.security.MessageDigest.getInstance("SHA-256");
                List<Path> classes;
                try (var paths = Files.walk(location.resolve("com/gsc/bm"))) {
                    classes = paths.filter(p -> p.toString().endsWith(".class")).sorted().collect(Collectors.toList());
                }
                if (classes.isEmpty()) { throw new IllegalStateException("Missing application classes"); }
                for (Path file : classes) {
                    digest.update(location.relativize(file).toString().replace('\\', '/').getBytes(StandardCharsets.UTF_8));
                    digest.update((byte) 0); digest.update(Files.readAllBytes(file));
                }
                code = org.apache.commons.codec.binary.Hex.encodeHexString(digest.digest());
            } else { code = sha256(Files.readAllBytes(location)); }
            Map<String, Object> found = MatchSnapshot.fields("codeSha256", code, "codeFormat", Files.isDirectory(location) ? "sorted-class-files" : "jar",
                    "rulesVersion", version.group(1), "rulesSha256", sha256(rulesText.getBytes(StandardCharsets.UTF_8)), "sets", sets(),
                    "catalogSha256", sha256(resource("cards.sqlite")), "rulesCatalogSha256", sha256(resource("analysis/rules-catalog.json")));
            // SB-8: a draft match says which draft it played; the catalog fields stay those of the packaged SQLite.
            if (draft != null) { found.put("draft", draft.describe()); }
            versions = Collections.unmodifiableMap(found);
        } catch (Exception e) { throw new IllegalStateException("Cannot identify match versions", e); }
    }
    /** R00/R07 1.13: id (file name) to version and SHA-256 (UTF-8, CRLF folded to LF) of every packaged set document. */
    private static Map<String, Object> sets() throws java.io.IOException {
        var found = new org.springframework.core.io.support.PathMatchingResourcePatternResolver(MatchVersions.class.getClassLoader())
                .getResources("classpath:analysis/sets/*.md");
        Map<String, Object> sets = new TreeMap<>();
        for (var document : found) {
            String name = Objects.requireNonNull(document.getFilename());
            String text;
            try (var in = document.getInputStream()) { text = new String(in.readAllBytes(), StandardCharsets.UTF_8).replace("\r\n", "\n"); }
            var version = java.util.regex.Pattern.compile("(?m)^Versione \\*\\*([0-9.]+) —").matcher(text);
            if (!version.find()) { throw new IllegalStateException("Missing version in set document " + name); }
            String id = name.substring(0, name.length() - ".md".length());
            if (sets.put(id, Collections.unmodifiableMap(MatchSnapshot.fields("version", version.group(1),
                    "sha256", sha256(text.getBytes(StandardCharsets.UTF_8))))) != null) { throw new IllegalStateException("Duplicate set document " + id); }
        }
        if (sets.isEmpty()) { throw new IllegalStateException("Missing set documents"); }
        return Collections.unmodifiableMap(sets);
    }
    private byte[] resource(String name) throws java.io.IOException {
        try (var in = new ClassPathResource(name).getInputStream()) { return in.readAllBytes(); }
    }
    public Map<String, Object> get() { return versions; }
}
