import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paca } from './paca.entity';
import { Detalle } from '../detalle/detalle.entity';
import { CreatePacaDto } from './dto/create-paca.dto';
import { UpdatePacaDto } from './dto/update-paca.dto';

@Injectable()
export class PacasService {
  constructor(
    @InjectRepository(Paca) private pacaRepo: Repository<Paca>,
    @InjectRepository(Detalle) private detalleRepo: Repository<Detalle>,
  ) {}

  findAll() {
    return this.pacaRepo.find({
      relations: ['detalles', 'detalles.producto', 'tipo'],
    });
  }

  findOne(id: number) {
    return this.pacaRepo.findOne({
      where: { id },
      relations: ['detalles', 'detalles.producto', 'tipo'],
    });
  }

  async create(createPacaDto: CreatePacaDto) {
    const { detalles, ...data } = createPacaDto;

    const paca = this.pacaRepo.create(data);
    const savedPaca = await this.pacaRepo.save(paca);

    if (detalles?.length) {
      const nuevosDetalles = detalles.map((d) =>
        this.detalleRepo.create({
          producto: { id: d.productoId },
          total: d.total,
          paca: savedPaca,
        }),
      );
      await this.detalleRepo.save(nuevosDetalles);
    }

    return this.findOne(savedPaca.id);
  }

  async update(id: number, updateDto: UpdatePacaDto) {
    const { detalles, ...data } = updateDto;

    await this.pacaRepo.update(id, data);

    if (detalles) {
      // Eliminar detalles anteriores
      await this.detalleRepo.delete({ paca: { id } });

      // Crear nuevos detalles
      const nuevosDetalles = detalles.map((d) =>
        this.detalleRepo.create({
          producto: { id: d.productoId },
          total: d.total,
          paca: { id },
        }),
      );
      await this.detalleRepo.save(nuevosDetalles);
    }

    return this.findOne(id);
  }

  remove(id: number) {
    return this.pacaRepo.delete(id);
  }
}
