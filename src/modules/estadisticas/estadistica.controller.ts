import { Controller, Get, Query } from '@nestjs/common';
import { EstadisticasService } from './estadistica.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly service: EstadisticasService) {}

  @Get('ventas-totales')
  ventasTotales(@Query('periodo') periodo: string) {
    return this.service.ventasTotales(periodo);
  }

  @Get('piezas-vendidas')
  piezasVendidas(@Query('periodo') periodo: string) {
    return this.service.piezasVendidas(periodo);
  }

  @Get('ingresos')
  ingresos(@Query('periodo') periodo: string) {
    return this.service.ingresos(periodo);
  }

  @Get('resumen-financiero')
  resumenFinanciero() {
    return this.service.resumenFinanciero();
  }

  @Get('resumen-piezas')
  resumenPiezas() {
    return this.service.resumenPiezas();
  }

  // @Get('ventas-por-tipo')
  // ventasPorTipo() {
  //   return this.service.ventasPorTipo();
  // }

  @Get('productos-mas-vendidos')
  productosMasVendidos() {
    return this.service.productosMasVendidos();
  }

  @Get('mes-mas-vendido')
  mesMasVendido() {
    return this.service.mesMasVendido();
  }
}
