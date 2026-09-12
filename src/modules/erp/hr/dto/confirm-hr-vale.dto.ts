import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum HrTreasuryTargetTypeDto {
  CASH_BOX = 'CASH_BOX',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export class ConfirmHrValeDto {
  @IsOptional()
  @IsEnum(HrTreasuryTargetTypeDto)
  treasury_target_type?: HrTreasuryTargetTypeDto;

  @IsOptional()
  @IsUUID()
  treasury_target_id?: string;
}
