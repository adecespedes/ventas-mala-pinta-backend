import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paca } from './paca.entity';
import { PacasService } from './paca.service';
import { PacasController } from './paca.controller';
import { Detalle } from '../detalle/detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paca, Detalle])],
  controllers: [PacasController],
  providers: [PacasService],
  exports: [TypeOrmModule],
})
export class PacasModule {}
