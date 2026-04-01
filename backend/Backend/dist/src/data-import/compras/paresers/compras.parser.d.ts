import { Parser, ParseResult } from '../../core/interfaces';
import { FacturaCompraRaw } from '../schemas/compras.schema';
export declare class FacturaCompraParser implements Parser<FacturaCompraRaw> {
    parse(raw: unknown[]): FacturaCompraRaw[];
    parseWithErrors(raw: unknown[]): ParseResult<FacturaCompraRaw>;
}
