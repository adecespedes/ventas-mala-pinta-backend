import {
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
// import { Paca } from '../pacas/paca.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private repo: Repository<Producto>,
    // @InjectRepository(Paca)
    // private pacaRepo: Repository<Paca>,
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

    // const pacasUsando = await this.pacaRepo.count({
    //   where: { producto: { id } },
    // });

    // if (pacasUsando > 0) {
    //   throw new BadRequestException(
    //     'Este producto está en uso por una o más pacas y no puede eliminarse.',
    //   );
    // }

    return this.repo.remove(producto);
  }
}
