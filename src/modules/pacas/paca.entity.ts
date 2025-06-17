// src/modules/pacas/paca.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tipo } from '../tipo/tipo.entity';
import { Detalle } from '../detalle/detalle.entity';

@Entity()
export class Paca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  cantidad: number;

  @ManyToOne(() => Tipo, { eager: true })
  @JoinColumn({ name: 'tipoId' })
  tipo: Tipo;

  @Column()
  tipoId: number;

  @Column()
  precio: number;

  @Column()
  cambio: number;

  @Column({ type: 'date' })
  fecha: string;

  @OneToMany(() => Detalle, (detalle) => detalle.paca, {
    cascade: true,
    eager: true,
  })
  detalles: Detalle[];
}
