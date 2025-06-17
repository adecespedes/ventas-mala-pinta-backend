import { IsNumber, IsPositive } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;
}
