import { BadRequestException, Injectable } from '@nestjs/common';
import { DummyParser } from './dummy-parser';
import { DummyTransformer } from './dummy-transformer';
import { DummySink } from './dummy-sink';
@Injectable()
export class ImportRegistry {
  get(type: string) {
    if (type === 'dummy') {
      return {
        parser: new DummyParser(),
        transformer: new DummyTransformer(),
        sink: new DummySink(),
      };
    }

    throw new BadRequestException('Tipo de importación inválido');
  }
}
