import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/venta.entity';
import { Paca } from '../pacas/paca.entity';
import { DetalleVenta } from '../detalleVenta/detalle-venta.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,

    @InjectRepository(Paca)
    private readonly pacaRepo: Repository<Paca>,

    @InjectRepository(DetalleVenta)
    private readonly detalleRepo: Repository<DetalleVenta>,
  ) {}

  async ventasTotales(periodo: string): Promise<
    {
      periodo: string;
      total: string;
      piezas: string;
      semana_inicio?: string;
      semana_fin?: string;
    }[]
  > {
    const query = this.ventaRepo.createQueryBuilder('v');

    let select = '';
    let group = '';
    let where = '';
    let order: any = null;

    if (periodo === 'dia') {
      select = "TO_CHAR(v.fecha, 'YYYY-MM-DD') AS periodo";
      group = 'periodo';
      where = 'v.fecha = CURRENT_DATE';
    } else if (periodo === 'semana') {
      // Usamos semana_inicio y semana_fin para tooltip
      select = `
      TO_CHAR(DATE_TRUNC('week', v.fecha), 'YYYY-MM-DD') AS periodo,
      DATE_TRUNC('week', v.fecha)::date AS semana_inicio,
      (DATE_TRUNC('week', v.fecha) + INTERVAL '6 days')::date AS semana_fin
    `;
      group = 'periodo, semana_inicio, semana_fin';
      where = `v.fecha >= DATE_TRUNC('month', CURRENT_DATE)`; // o el rango que quieras
      order = { semana_inicio: 'ASC' };
    } else if (periodo === 'mes') {
      select = `
      TRIM(TO_CHAR(v.fecha, 'Month')) AS periodo,
      EXTRACT(MONTH FROM v.fecha) AS mes
    `;
      group = 'periodo, mes';
      where = 'EXTRACT(YEAR FROM v.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)';
      order = { mes: 'ASC' };
    } else if (periodo === 'anio') {
      select = 'EXTRACT(YEAR FROM v.fecha)::TEXT AS periodo';
      group = 'periodo';
      order = { periodo: 'ASC' };
    } else {
      throw new Error('Periodo no válido');
    }

    return await query
      .select(
        `${select}, SUM(v.totalPrecio) AS total, SUM(v.totalPiezas) AS piezas`,
      )
      .where(where)
      .groupBy(group)
      .orderBy(order || group)
      .getRawMany();
  }

  async piezasVendidas(periodo: string) {
    const rango = this.calcularRango(periodo);
    const detalles = await this.detalleRepo
      .createQueryBuilder('detalle')
      .innerJoin('detalle.venta', 'venta')
      .select('SUM(detalle.cantidad)', 'total')
      .where('venta.fecha BETWEEN :inicio AND :fin', rango)
      .getRawOne<{ total: string | null }>();

    return Number(detalles?.total || 0);
  }

  async ingresos(periodo: string) {
    const rango = this.calcularRango(periodo);

    const total = await this.ventaRepo
      .createQueryBuilder('venta')
      .select('SUM(venta.totalPrecio)', 'usd')
      .where('venta.fecha BETWEEN :inicio AND :fin', rango)
      .getRawOne<{ usd: string | null; local: string | null }>();

    return {
      local: Number(total?.usd || 0),
    };
  }

  calcularRango(periodo: string) {
    const hoy = new Date();
    let inicio: Date;
    let fin: Date;

    switch (periodo) {
      case 'dia':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        break;

      case 'semana': {
        // Obtener el lunes de la semana actual
        const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        const diffLunes = diaSemana === 0 ? 6 : diaSemana - 1; // si es domingo, retrocede 6 días, sino días desde lunes
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - diffLunes);
        inicio.setHours(0, 0, 0, 0);
        fin = new Date(inicio);
        fin.setDate(inicio.getDate() + 6);
        fin.setHours(23, 59, 59, 999);
        break;
      }

      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        fin.setHours(23, 59, 59, 999);
        break;

      case 'mes_pasado':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        fin.setHours(23, 59, 59, 999);
        break;

      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1);
        fin = new Date(hoy.getFullYear(), 11, 31);
        fin.setHours(23, 59, 59, 999);
        break;

      case 'anio_pasado':
        inicio = new Date(hoy.getFullYear() - 1, 0, 1);
        fin = new Date(hoy.getFullYear() - 1, 11, 31);
        fin.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error(`Periodo desconocido: ${periodo}`);
    }

    return {
      inicio: inicio.toISOString().split('T')[0],
      fin: fin.toISOString().split('T')[0],
    };
  }

  // async ventasPorTipo(): Promise<{ tipo: string; cantidad: string }[]> {
  //   return this.ventaRepo
  //     .createQueryBuilder('venta')
  //     .innerJoin('venta.tipo', 'tipo')
  //     .select('tipo.nombre', 'tipo')
  //     .addSelect('COUNT(*)', 'cantidad')
  //     .groupBy('tipo.nombre')
  //     .orderBy('cantidad', 'DESC')
  //     .getRawMany<{ tipo: string; cantidad: string }>();
  // }

  async resumenFinanciero(): Promise<{
    ingresos: number;
    gastos: number;
    balance: number;
  }> {
    const ingresos = await this.ventaRepo
      .createQueryBuilder('v')
      .select('SUM(v.totalPrecio)', 'total')
      .getRawOne<{ total: string | null }>();

    const gastos = await this.pacaRepo
      .createQueryBuilder('p')
      .select('SUM(p.precioMN)', 'total')
      .getRawOne<{ total: string | null }>();

    return {
      ingresos: Number(ingresos?.total || 0),
      gastos: Number(gastos?.total || 0),
      balance: Number(ingresos?.total || 0) - Number(gastos?.total || 0),
    };
  }

  async productosMasVendidos(): Promise<{ producto: string; total: string }[]> {
    return this.detalleRepo
      .createQueryBuilder('detalle')
      .innerJoin('detalle.producto', 'producto')
      .select('producto.nombre', 'producto')
      .addSelect('SUM(detalle.cantidad)', 'total')
      .groupBy('producto.nombre')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany<{ producto: string; total: string }>();
  }

  async mesMasVendido() {
    const ventasPorMes = await this.ventaRepo
      .createQueryBuilder('v')
      .select("TO_CHAR(v.fecha, 'YYYY-MM')", 'mes')
      .addSelect('SUM(v."totalPiezas")', 'totalPiezas')
      .addSelect('SUM(v."totalPrecio")', 'totalPrecio')
      .groupBy('mes')
      .orderBy('"totalPrecio"', 'DESC') // <-- Aquí las comillas dobles importantes
      .limit(1)
      .getRawOne<{ mes: string; totalPiezas: string; totalPrecio: string }>();

    return ventasPorMes;
  }
}
