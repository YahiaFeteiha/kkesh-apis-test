import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EyeModule } from './eye/eye.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'kkesh-test',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AppointmentModule,
    EyeModule,
    InquiryModule,
    AnalyticsModule,
    CustomerModule,
  ],
})
export class AppModule {}
