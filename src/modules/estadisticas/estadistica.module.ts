import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadistica.service';
import { EstadisticasController } from './estadistica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../ventas/venta.entity';
import { DetalleVenta } from '../detalleVenta/detalle-venta.entity';
import { Producto } from '../productos/producto.entity';
import { Tipo } from '../tipo/tipo.entity';
import { Paca } from '../pacas/paca.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Producto, Tipo, Paca]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
