import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private repo: Repository<Producto>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const producto = await this.repo.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  create(createDto: CreateProductoDto) {
    const producto = this.repo.create(createDto);
    return this.repo.save(producto);
  }

  async update(id: number, updateDto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    Object.assign(producto, updateDto);
    return this.repo.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.repo.remove(producto);
  }
}
