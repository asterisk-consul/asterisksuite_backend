import { IsOptional, IsString } from 'class-validator';

export class SyncExchangeDto {
  @IsOptional()
  @IsString()
  source?: string;
}
