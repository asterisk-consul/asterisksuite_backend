import { IsUUID } from 'class-validator';

export class DeliverContainerDto {
  @IsUUID()
  destination_warehouse_id!: string;
}
