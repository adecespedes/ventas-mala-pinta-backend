import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { VentasService } from './venta.service';
import { VentasController } from './venta.controller';
import { DetalleVenta } from '../detalleVenta/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [TypeOrmModule],
})
export class VentasModule {}
