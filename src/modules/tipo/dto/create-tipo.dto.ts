import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  activo: boolean;
}
