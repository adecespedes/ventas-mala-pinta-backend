import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './modules/productos/producto.module';

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
  ],
})
export class AppModule {}
