import { KindeModule } from '@amsame/kinde-auth-nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EhrModule } from './ehr/ehr.module';
import { FormModule } from './form/form.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, KindeModule, EhrModule, FormModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
