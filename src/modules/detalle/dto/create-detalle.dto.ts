import { IsNumber, IsPositive } from 'class-validator';

export class CreateDetalleDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  @IsPositive()
  total: number;
}
