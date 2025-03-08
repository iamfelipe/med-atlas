import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  providers: [FormService, PrismaService],
  exports: [FormService],
})
export class FormModule {}
