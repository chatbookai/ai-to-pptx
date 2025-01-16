interface SSEOptions {
  headers?: Record<string, string>;
  payload?: string;
  method?: string;
  withCredentials?: boolean;
}

interface SSEEvent extends Event {
  data: string;
  id?: string | null;
  readyState?: any;
  event?: any;
}

class SSE {
  private readonly INITIALIZING = -1;
  private readonly CONNECTING = 0;
  private readonly OPEN = 1;
  private readonly CLOSED = 2;

  private readonly FIELD_SEPARATOR = ":";

  private xhr: XMLHttpRequest | null = null;
  private listeners: Record<string, Array<(e: SSEEvent) => void>> = {};
  private progress = 0;
  private chunk = "";

  public readyState: number;
  public url: string;
  public headers: Record<string, string>;
  public payload: string;
  public method: string;
  public withCredentials: boolean;

  constructor(url: string, options: SSEOptions = {}) {
    this.url = url;
    this.headers = options.headers || {};
    this.payload = options.payload !== undefined ? options.payload : "";
    this.method = options.method || (this.payload ? "POST" : "GET");
    this.withCredentials = !!options.withCredentials;
    this.readyState = this.INITIALIZING;
  }

  addEventListener(type: string, listener: (e: SSEEvent) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    if (!this.listeners[type].includes(listener)) {
      this.listeners[type].push(listener);
    }
  }

  removeEventListener(type: string, listener: (e: SSEEvent) => void): void {
    if (!this.listeners[type]) return;

    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    if (this.listeners[type].length === 0) {
      delete this.listeners[type];
    }
  }

  dispatchEvent(e: SSEEvent): boolean {
    if (!e) return true;

    (e as any).source = this;

    const onHandler = `on${e.type}`;
    if (onHandler in this && typeof (this as any)[onHandler] === "function") {
      (this as any)[onHandler](e);
      if (e.defaultPrevented) return false;
    }

    if (this.listeners[e.type]) {
      return this.listeners[e.type].every((callback) => {
        callback(e);

        return !e.defaultPrevented;
      });
    }

    return true;
  }

  private _setReadyState(state: number): void {
    this.readyState = state;
    const event = new CustomEvent("readystatechange") as unknown as SSEEvent;
    event.readyState = state;
    this.dispatchEvent(event);
  }

  private _onStreamFailure(e: ProgressEvent): void {
    const event = new CustomEvent("error") as unknown as SSEEvent;
    event.data = (e.target as XMLHttpRequest)?.responseText || "";
    this.dispatchEvent(event);
    this.close();
  }

  private _onStreamAbort(): void {
    this.dispatchEvent(new CustomEvent("abort") as unknown as SSEEvent);
    this.close();
  }

  private _onStreamProgress(e: ProgressEvent): void {
    if (!this.xhr) return;

    if (this.xhr.status !== 200) {
      this._onStreamFailure(e);

      return;
    }

    if (this.readyState === this.CONNECTING) {
      this.dispatchEvent(new CustomEvent("open") as unknown as SSEEvent);
      this._setReadyState(this.OPEN);
    }

    const data = this.xhr.responseText.substring(this.progress);
    this.progress += data.length;

    data.split(/(\r\n|\r|\n){2}/g).forEach((part) => {
      if (part.trim().length === 0) {
        this.dispatchEvent(this._parseEventChunk(this.chunk.trim()) as SSEEvent);
        this.chunk = "";
      } else {
        this.chunk += part;
      }
    });
  }

  private _onStreamLoaded(e: ProgressEvent): void {
    this._onStreamProgress(e);

    // Parse the last chunk
    this.dispatchEvent(this._parseEventChunk(this.chunk) as SSEEvent);
    this.chunk = "";
  }

  private _parseEventChunk(chunk: string): SSEEvent | null {
    if (!chunk) return null;

    const e: Partial<SSEEvent> = { data: "", event: "message" };
    chunk.split(/\n|\r\n|\r/).forEach((line) => {
      line = line.trimEnd();
      const index = line.indexOf(this.FIELD_SEPARATOR);
      if (index <= 0) return;

      const field = line.substring(0, index);
      const value = line.substring(index + 1).trimStart();

      if (field === "data") {
        e.data += value;
      } else if (field in e) {
        (e as any)[field] = value;
      }
    });

    const event = new CustomEvent(e.event || "message") as unknown as SSEEvent;
    event.data = e.data || "";
    event.id = e.id || null;

    return event;
  }

  private _checkStreamClosed(): void {
    if (!this.xhr) return;

    if (this.xhr.readyState === XMLHttpRequest.DONE) {
      this._setReadyState(this.CLOSED);
      const event = new CustomEvent("end") as unknown as SSEEvent;
      event.data = this.xhr.responseText;
      this.dispatchEvent(event);
    }
  }

  stream(): void {
    this._setReadyState(this.CONNECTING);

    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener("progress", this._onStreamProgress.bind(this));
    this.xhr.addEventListener("load", this._onStreamLoaded.bind(this));
    this.xhr.addEventListener(
      "readystatechange",
      this._checkStreamClosed.bind(this)
    );
    this.xhr.addEventListener("error", this._onStreamFailure.bind(this));
    this.xhr.addEventListener("abort", this._onStreamAbort.bind(this));
    this.xhr.open(this.method, this.url);

    for (const header in this.headers) {
      this.xhr.setRequestHeader(header, this.headers[header]);
    }

    this.xhr.withCredentials = this.withCredentials;
    this.xhr.send(this.payload);
  }

  close(): void {
    if (this.readyState === this.CLOSED) return;

    this.xhr?.abort();
    this.xhr = null;
    this._setReadyState(this.CLOSED);
  }
}

export { SSE };
