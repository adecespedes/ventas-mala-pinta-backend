import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipo } from './tipo.entity';
import { Paca } from '../pacas/paca.entity';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';

@Injectable()
export class TiposService {
  constructor(
    @InjectRepository(Tipo)
    private repo: Repository<Tipo>,
    @InjectRepository(Paca)
    private pacaRepo: Repository<Paca>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const tipo = await this.repo.findOneBy({ id });
    if (!tipo) throw new NotFoundException('Producto no encontrado');
    return tipo;
  }

  create(createDto: CreateTipoDto) {
    const tipo = this.repo.create(createDto);
    return this.repo.save(tipo);
  }

  async update(id: number, updateDto: UpdateTipoDto) {
    const tipo = await this.findOne(id);
    Object.assign(tipo, updateDto);
    return this.repo.save(tipo);
  }

  async remove(id: number) {
    const tipo = await this.findOne(id);

    const pacasUsando = await this.pacaRepo.count({
      where: { tipo: { id } },
    });

    if (pacasUsando > 0) {
      throw new BadRequestException(
        'Este tipo de paca está en uso por una o más pacas y no puede eliminarse.',
      );
    }

    return this.repo.remove(tipo);
  }
}
