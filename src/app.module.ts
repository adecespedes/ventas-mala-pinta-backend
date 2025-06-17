import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './modules/productos/producto.module';
import { PacasModule } from './modules/pacas/paca.module';
import { TiposModule } from './modules/tipo/tipo.module';
import { VentasModule } from './modules/ventas/venta.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // o tu base
      host: 'localhost',
      port: 5432,
      username: 'adecespedes',
      password: '',
      database: 'ventas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // solo en desarrollo
    }),
    ProductosModule,
    PacasModule,
    TiposModule,
    VentasModule,
  ],
})
export class AppModule {}
