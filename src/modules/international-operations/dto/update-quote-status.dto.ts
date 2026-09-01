import { IsEnum } from 'class-validator';
import { QuoteStatus } from '@/generated/prisma/enums';

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatus)
  status: QuoteStatus;
}
