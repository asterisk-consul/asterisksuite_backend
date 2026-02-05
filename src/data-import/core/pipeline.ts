import { DataSource, Parser, Transformer, Sink } from './interfaces';

export class ImportPipeline {
  constructor(
    private source: DataSource,
    private parser: Parser<any>,
    private transformer: Transformer<any, any>,
    private sink: Sink<any>,
  ) {}

  async run() {
    const raw = await this.source.load();
    const parsed = await this.parser.parse(raw);
    const transformed = await this.transformer.transform(parsed);
    await this.sink.send(transformed);

    return {
      ok: true,
      count: transformed.length,
    };
  }
}
