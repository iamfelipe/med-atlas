import { KindeModule } from '@amsame/kinde-auth-nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EhrModule } from './ehr/ehr.module';

@Module({
  imports: [UserModule, KindeModule, EhrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
