import { Module } from '@nestjs/common';
import { EhrService } from './ehr.service';
import { EhrController } from './ehr.controller';

@Module({
  controllers: [EhrController],
  providers: [EhrService],
})
export class EhrModule {}
