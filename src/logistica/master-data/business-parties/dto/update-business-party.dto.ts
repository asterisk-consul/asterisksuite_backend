import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessPartyDto } from './create-business-party.dto';

export class UpdateBusinessPartyDto extends PartialType(
  CreateBusinessPartyDto,
) {}
