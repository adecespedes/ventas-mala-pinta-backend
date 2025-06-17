import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { ProductosService } from './producto.service';
import { ProductosController } from './producto.controller';
import { PacasModule } from '../pacas/paca.module';
import { VentasModule } from '../ventas/venta.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto]), PacasModule, VentasModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
