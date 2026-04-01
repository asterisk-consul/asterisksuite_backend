import { Sink } from '../core/interfaces';
export declare class ArticuloPrecioSink implements Sink<any> {
    send(data: any[]): Promise<void>;
}
