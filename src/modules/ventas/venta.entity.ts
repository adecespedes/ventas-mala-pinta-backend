// venta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetalleVenta } from '../detalleVenta/detalle-venta.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPrecio: number;

  @Column()
  totalPiezas: number;

  @Column({ type: 'date' })
  fecha: string;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, {
    cascade: true,
    eager: true,
  })
  detalles: DetalleVenta[];
}
