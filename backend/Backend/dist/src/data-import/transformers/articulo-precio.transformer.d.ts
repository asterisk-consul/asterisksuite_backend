import { Transformer } from '../core/interfaces';
import { ArticuloPrecioRaw } from '../schemas/articulo-precio.schema';
export declare class ArticuloPrecioTransformer implements Transformer<ArticuloPrecioRaw, any> {
    transform(input: ArticuloPrecioRaw[]): Promise<any[]>;
}
