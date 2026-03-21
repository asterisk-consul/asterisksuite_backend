import { PartialType } from '@nestjs/mapped-types';
import { CreatePartyContactDto } from './create-party-contact.dto';

export class UpdatePartyContactDto extends PartialType(CreatePartyContactDto) {}
