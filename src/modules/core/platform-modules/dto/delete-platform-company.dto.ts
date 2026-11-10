import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeletePlatformCompanyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  confirmSubdomain!: string;
}
