import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from '../detalleVenta/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventaRepo: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleRepo: Repository<DetalleVenta>,
  ) {}

  findAll() {
    return this.ventaRepo.find({
      relations: ['detalles'],
    });
  }

  findOne(id: number) {
    return this.ventaRepo.findOne({
      where: { id },
      relations: ['detalles'],
    });
  }

  async create(createVentaDto: CreateVentaDto) {
    const { detalles, ...data } = createVentaDto;

    const venta = this.ventaRepo.create(data);
    const savedVenta = await this.ventaRepo.save(venta);

    if (detalles?.length) {
      const nuevosDetalles = detalles.map((d) =>
        this.detalleRepo.create({
          producto: { id: d.productoId },
          cantidad: d.cantidad,
          venta: savedVenta,
        }),
      );
      await this.detalleRepo.save(nuevosDetalles);
    }

    return this.findOne(savedVenta.id);
  }

  async update(id: number, updateDto: UpdateVentaDto) {
    const { detalles, ...data } = updateDto;

    await this.ventaRepo.update(id, data);

    if (detalles) {
      // Eliminar detalles anteriores
      await this.detalleRepo.delete({ venta: { id } });

      // Crear nuevos detalles
      const nuevosDetalles = detalles.map((d) =>
        this.detalleRepo.create({
          producto: { id: d.productoId },
          cantidad: d.cantidad,
          venta: { id },
        }),
      );
      await this.detalleRepo.save(nuevosDetalles);
    }

    return this.findOne(id);
  }

  remove(id: number) {
    return this.ventaRepo.delete(id);
  }
}
