import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class DismissNotificationAlertDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[a-zA-Z0-9:_-]+$/)
  alert_key!: string;
}
