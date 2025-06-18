import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './modules/productos/producto.module';
import { PacasModule } from './modules/pacas/paca.module';
import { TiposModule } from './modules/tipo/tipo.module';
import { VentasModule } from './modules/ventas/venta.module';
import { EstadisticasModule } from './modules/estadisticas/estadistica.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'ventas',
      autoLoadEntities: true,
      // synchronize: true, // ⚠️ Solo en desarrollo
    }),
    ProductosModule,
    PacasModule,
    TiposModule,
    VentasModule,
    EstadisticasModule,
  ],
})
export class AppModule {}
