import { CreateDetalleVentaDto } from '../../detalleVenta/dto/create-detalle-venta.dto';

export class UpdateVentaDto {
  totalPrecio?: number;
  totalPiezas?: number;
  fecha?: string; // Formato 'YYYY-MM-DD'
  detalles?: CreateDetalleVentaDto[];
}
