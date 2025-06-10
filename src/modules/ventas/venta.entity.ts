// src/modules/ventas/venta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  items: {
    productoId: number;
    nombre: string;
    cantidadPiezas: number;
    precioUnitario: number;
  }[];

  @Column('decimal')
  total: number;

  @CreateDateColumn()
  fecha: Date;
}
