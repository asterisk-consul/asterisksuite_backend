export interface DataSource {
  load(): Promise<unknown[]>;
}

export interface Parser<T> {
  parse(raw: unknown[]): Promise<T[]>;
}

export interface Transformer<I, O> {
  transform(input: I[]): Promise<O[]>;
}

export interface Sink<T> {
  send(data: T[]): Promise<void>;
}
