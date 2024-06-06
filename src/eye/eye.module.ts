import { Module } from '@nestjs/common';
import { EyeService } from './eye.service';
import { EyeController } from './eye.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eye } from './entities/eye.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Eye])],
  controllers: [EyeController],
  providers: [EyeService],
  exports: [EyeModule],
})
export class EyeModule {}
