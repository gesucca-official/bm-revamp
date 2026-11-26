// Transport boundary: the session sees only these operations, so tests can replace the server.
export interface Link {
  /** Resolves when the server's RECEIPT confirms the subscription; then a SEND cannot outrun it. */
  subscribe(destination: string, handler: (body: string) => void): Promise<() => void>;
  /** `headers` are STOMP native headers: quick joins carry `category`, quick/open 1vCom also carry `level` (SB-29, SB-30a). */
  send(destination: string, body?: string, headers?: Record<string, string>): void;
  /** Deliberate close: no drop notification. */
  close(): void;
  /** Diagnostic transport drop, equivalent to the debug dropConnection(). */
  drop(): void;
}
export interface Connector {
  validate(username: string, password: string): Promise<boolean>;
  connect(username: string, password: string, onDrop: () => void): Promise<Link>;
}
