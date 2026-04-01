import { Parser, ParseResult } from '../core/interfaces';
import { ArticuloPrecioRaw } from '../schemas/articulo-precio.schema';
export declare class ArticuloPrecioParser implements Parser<ArticuloPrecioRaw> {
    parse(raw: unknown[]): ArticuloPrecioRaw[];
    parseWithErrors(raw: unknown[]): ParseResult<ArticuloPrecioRaw>;
}
