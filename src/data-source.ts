import { DataSource } from 'typeorm';
import { Paca } from './modules/pacas/paca.entity'; // Ajusta según tu ruta y entidades
import { Venta } from './modules/ventas/venta.entity';
import { Tipo } from './modules/tipo/tipo.entity';
import { Detalle } from './modules/detalle/detalle.entity';
import { Producto } from './modules/productos/producto.entity';
import { DetalleVenta } from './modules/detalleVenta/detalle-venta.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'adecespedes',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'ventas',
  entities: [Paca, Venta, Tipo, Detalle, Producto, DetalleVenta],
  migrations: ['src/migration/*.ts'],
  synchronize: false, // En migraciones debe ser false
});

export default AppDataSource;
