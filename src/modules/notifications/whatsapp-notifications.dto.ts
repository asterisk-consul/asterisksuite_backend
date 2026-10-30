import { ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsInt, IsString, IsUUID, Matches, Max, Min, ValidateIf } from 'class-validator';

export class UpdateWhatsAppContactDto {
  @ValidateIf(value => value.opted_in || Boolean(value.phone_e164?.trim()))
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Usá el formato internacional con + y código de país, por ejemplo +54911XXXXXXXX.',
  })
  phone_e164!: string;

  @IsBoolean()
  opted_in!: boolean;
}

export class UpdateWhatsAppNotificationSettingsDto {
  @IsBoolean()
  enabled!: boolean;

  @IsBoolean()
  assignments_enabled!: boolean;

  @IsBoolean()
  customer_balances_enabled!: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  customer_balance_recipient_ids!: string[];

  @IsBoolean()
  supplier_balances_enabled!: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  supplier_balance_recipient_ids!: string[];

  @IsBoolean()
  checks_enabled!: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  check_recipient_ids!: string[];

  @IsInt()
  @Min(15)
  @Max(300)
  min_interval_seconds!: number;

  @IsInt()
  @Min(10)
  @Max(120)
  batch_window_seconds!: number;
}
