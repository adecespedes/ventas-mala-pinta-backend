import { IsDateString } from 'class-validator';

export class CreateDetalleDto {
  productoId: number;
  total: number;
}

export class CreatePacaDto {
  nombre: string;
  cantidad: number;
  tipoId: number;
  precio: number;
  cambio: number;
  @IsDateString()
  fecha: string; // Formato 'YYYY-MM-DD'
  detalles: CreateDetalleDto[];
}
