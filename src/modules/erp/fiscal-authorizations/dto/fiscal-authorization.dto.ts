import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateFiscalAuthorizationDto {
  @IsOptional() @IsIn(['CAI', 'CAE', 'CAEA']) authorization_type?: string;
  @IsString() @MaxLength(50) code: string;
  @IsUUID() document_type_id: string;
  @IsUUID() document_sequence_id: string;
  @IsDateString() valid_from: string;
  @IsDateString() valid_to: string;
  @Type(() => Number) @IsInt() @Min(1) range_from: number;
  @Type(() => Number) @IsInt() @Min(1) range_to: number;
  @IsOptional() @IsDateString() replacement_date?: string;
  @IsOptional() @IsString() observations?: string;
  @IsOptional() @IsUUID() attachment_file_id?: string;
}

export class UpdateFiscalAuthorizationDto extends CreateFiscalAuthorizationDto {
  @IsOptional() @IsIn(['ACTIVE', 'REPLACED', 'ANNULLED']) status?: string;
}

export class UpdateFiscalAuthorizationSettingsDto {
  @IsBoolean() alerts_enabled: boolean;
  @IsArray() day_thresholds: number[];
  @IsArray() number_thresholds: number[];
  @IsIn(['BLOCK', 'WARN', 'OFF']) expired_policy: string;
  @IsIn(['BLOCK', 'WARN', 'OFF']) missing_policy: string;
  @IsBoolean() daily_after_expiration: boolean;
  @IsOptional() @IsArray() notify_roles?: string[];
}
