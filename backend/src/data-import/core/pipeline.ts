import {
  DataSource,
  Parser,
  Transformer,
  Sink,
  ParseResult,
} from './interfaces';

export class ImportPipeline<TRaw, TTransformed> {
  constructor(
    private source: DataSource,
    private parser: Parser<TRaw>,
    private transformer: Transformer<TRaw, TTransformed>,
    private sink: Sink<TTransformed>,
  ) {}

  async run() {
    try {
      // 1. Cargar datos del source
      const rawData = await this.source.load();
      console.log(`✓ Filas extraídas: ${rawData.length}`);

      // 2. Parsear con manejo de errores
      const parseResult = this.parser.parseWithErrors
        ? this.parser.parseWithErrors(rawData)
        : { success: this.parser.parse(rawData), errors: [] };

      console.log(`✓ Parseadas exitosamente: ${parseResult.success.length}`);
      if (parseResult.errors.length > 0) {
        console.warn(`⚠ Con errores: ${parseResult.errors.length}`);
      }

      // 3. Transformar todos los datos válidos de una vez
      const transformed = await this.transformer.transform(parseResult.success);

      // 4. Guardar en BD solo los válidos
      if (transformed.length > 0) {
        await this.sink.send(transformed);
        console.log(`✓ Guardados en BD: ${transformed.length}`);
      }

      // 5. Retornar resultado completo
      return {
        success: true,
        total: rawData.length,
        parsed: parseResult.success.length,
        saved: transformed.length,
        failed: parseResult.errors.length,
        errors: parseResult.errors,
      };
    } catch (error) {
      console.error('❌ Error en pipeline:', error);
      return {
        success: false,
        total: 0,
        parsed: 0,
        saved: 0,
        failed: 0,
        message: error.message,
        error: error.stack,
      };
    }
  }
}
