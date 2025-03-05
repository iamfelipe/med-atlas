import { KindeModule } from '@amsame/kinde-auth-nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, KindeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
