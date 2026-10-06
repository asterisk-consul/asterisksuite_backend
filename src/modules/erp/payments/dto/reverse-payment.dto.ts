import { IsIn, IsOptional } from 'class-validator';

export class ReversePaymentDto {
  @IsOptional()
  @IsIn(['RETURN_TO_PORTFOLIO', 'CANCEL'])
  check_action?: 'RETURN_TO_PORTFOLIO' | 'CANCEL';
}
