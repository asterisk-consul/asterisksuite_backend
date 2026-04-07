import { Module } from '@nestjs/common';
import { WarehouseDomainModule } from './warehouse/warehouse.module';
import { TransportDomainModule } from './transport/transport.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [WarehouseDomainModule, TransportDomainModule, MediaModule],
})
export class LogisticaModule {}
