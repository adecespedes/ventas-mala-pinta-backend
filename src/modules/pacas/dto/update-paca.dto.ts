import { CreateDetalleDto } from '../../detalle/dto/create-detalle.dto';

export class UpdatePacaDto {
  nombre?: string;
  cantidad?: number;
  tipoId?: number;
  precio?: number;
  cambio?: number;
  fecha?: string; // Formato 'YYYY-MM-DD'
  detalles?: CreateDetalleDto[];
}
