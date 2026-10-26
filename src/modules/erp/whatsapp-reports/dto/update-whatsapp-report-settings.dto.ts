import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

const groupIdPattern = /^[a-zA-Z0-9._-]+@g\.us$/;

export class UpdateWhatsAppReportSettingsDto {
  @IsBoolean()
  enabled!: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  selected_company_ids!: string[];

  @IsBoolean()
  consolidated_enabled!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Matches(groupIdPattern, { message: 'El grupo del consolidado debe tener un identificador de WhatsApp válido (@g.us)' })
  consolidated_group_id?: string | null;

  @IsBoolean()
  inventory_enabled!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Matches(groupIdPattern, { message: 'El grupo de inventario debe tener un identificador de WhatsApp válido (@g.us)' })
  inventory_group_id?: string | null;
}

export class TestWhatsAppReportSettingsDto {
  @IsString()
  @Matches(/^(consolidated|inventory)$/)
  destination!: 'consolidated' | 'inventory';

  @IsOptional()
  @IsIn(['text', 'pdf'])
  format?: 'text' | 'pdf';
}
