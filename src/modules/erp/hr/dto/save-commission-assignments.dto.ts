import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNumber, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class CommissionAssignmentDto {
  @IsUUID()
  seller_id!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  participation_rate!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  commission_rate!: number;

  @IsIn(['INVOICED', 'PAID'])
  commission_base!: 'INVOICED' | 'PAID';
}

export class SaveCommissionAssignmentsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CommissionAssignmentDto)
  assignments!: CommissionAssignmentDto[];
}
