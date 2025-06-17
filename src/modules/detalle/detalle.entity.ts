// detalle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paca } from '../pacas/paca.entity';
import { Producto } from '../productos/producto.entity';

@Entity()
export class Detalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @ManyToOne(() => Paca, (paca) => paca.detalles, { onDelete: 'CASCADE' })
  paca: Paca;
}
