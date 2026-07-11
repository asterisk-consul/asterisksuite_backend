import { IsOptional, IsUUID } from 'class-validator';

export class LinkUserDto {
  @IsUUID()
  user_id!: string;
}
