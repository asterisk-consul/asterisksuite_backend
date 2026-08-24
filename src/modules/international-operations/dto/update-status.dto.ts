import { IsEnum } from 'class-validator';
import { OperationStatus } from '@/generated/prisma/enums';

export class UpdateOperationStatusDto {
  @IsEnum(OperationStatus)
  status!: OperationStatus;
}
