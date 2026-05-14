import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { AccountType } from '@/generated/prisma/enums';

export class CreateAccountDto {
  @IsString()
  @MaxLength(50)
  code!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEnum(AccountType)
  account_type!: AccountType;

  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
