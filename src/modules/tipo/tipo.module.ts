import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipo } from './tipo.entity';
import { TiposService } from './tipo.service';
import { TiposController } from './tipo.controller';
import { PacasModule } from '../pacas/paca.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tipo]), PacasModule],
  controllers: [TiposController],
  providers: [TiposService],
})
export class TiposModule {}
