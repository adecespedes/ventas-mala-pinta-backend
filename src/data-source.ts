import { DataSource } from 'typeorm';
import { Paca } from './modules/pacas/paca.entity'; // Ajusta según tu ruta y entidades
import { Venta } from './modules/ventas/venta.entity';
import { Tipo } from './modules/tipo/tipo.entity';
import { Detalle } from './modules/detalle/detalle.entity';
import { Producto } from './modules/productos/producto.entity';
import { DetalleVenta } from './modules/detalleVenta/detalle-venta.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'adecespedes',
  password: '',
  database: 'ventas',
  entities: [Paca, Venta, Tipo, Detalle, Producto, DetalleVenta],
  migrations: ['src/migration/*.ts'],
  synchronize: false, // En migraciones debe ser false
});
