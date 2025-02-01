import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  standalone: false,
  providers: []
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  columnasTabla: string[] = ['order_date', 'customer_name', 'total', 'status', 'Accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _UtilidadServicio: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ["fecha"],
      numero: [""],
      fecha: [""]
    });
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  ngOnInit(): void {
    this.cargarHistorialVentas();
    this.datosListaVenta.filterPredicate = this.crearFiltro();

    this.formularioBusqueda.valueChanges.subscribe(() => {
      this.aplicarFiltroFecha();
    });
  }

  cargarHistorialVentas(): void {
    this._ventaServicio.getHistorialVentas().subscribe({
      next: (response) => {
        if (response.status) {
          this.datosListaVenta.data = response.value.map((venta: Venta) => {
            return {
              ...venta,
              order_date: venta.order_date!.split('T')[0]
            };
          });
          this.datosListaVenta.filter = JSON.stringify({
            nombre: '',
            fecha: ''
          });
        } else {
          this._UtilidadServicio.mostrarAlerta('No se encontraron datos');
        }
      },
      error: (error) => {
        console.error('Error al cargar el historial de ventas:', error);
        this._UtilidadServicio.mostrarAlerta('Error al cargar el historial');
      },
    });
  }

  aplicarFiltro(event: Event): void {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.datosListaVenta.filter = JSON.stringify({
      nombre: filtroValor,
    });
  }

  aplicarFiltroFecha(): void {
    const nuevoFiltro = JSON.stringify({
      nombre: this.formularioBusqueda.value.numero
    });
    this.datosListaVenta.filter = nuevoFiltro;
  }

  limpiarFechas(): void {
    this.formularioBusqueda.patchValue({
      fecha: ''
    });
  }

  crearFiltro(): (data: Venta, filter: string) => boolean {
    return (data: Venta, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      const filtroNombre = data.customer_name!.toLowerCase().includes(searchTerms.nombre.toLowerCase());

      return filtroNombre ;
    };
  }

  verDetalleVenta(_venta: Venta): void {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: "700px"
    });
  }
}
