import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class alertService {
  constructor() {
    console.log('se creo la persona');
  }
  findAll() {
    return [];
  }
}
