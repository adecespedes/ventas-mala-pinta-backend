// create-venta.dto.ts
import { IsDateString } from 'class-validator';

export class CreateDetalleVentaDto {
  productoId: number;
  cantidad: number;
}

export class CreateVentaDto {
  totalPrecio: number;
  totalPiezas: number;
  @IsDateString()
  fecha: string;
  detalles: CreateDetalleVentaDto[];
}
