import { CreateDriverDto } from './create-driver.dto';
import { DriverDocumentDto } from './driver-document.dto';
declare const UpdateDriverDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDriverDto>>;
export declare class UpdateDriverDto extends UpdateDriverDto_base {
    documents?: DriverDocumentDto[];
}
export {};
