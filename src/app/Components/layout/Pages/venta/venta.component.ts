import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import { Customer } from 'src/app/Interfaces/customer';
import { ClienteService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  standalone: false
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = []; // Lista de productos disponibles
  listaClientes: Customer[] = []; // Lista de clientes registrados
  listaClientesFiltro: Customer[] = []; // Lista de clientes filtrados
  listaProductosFiltro: Producto[] = []; // Lista de productos filtrados
  listaProductosVenta: DetalleVenta[] = []; // Lista de productos en la venta actual
  bloquearBotonRegistrar: boolean = false; // Bloquea el botón de registrar venta
  productoSeleccionado!: Producto; // Producto seleccionado para la venta
  clienteSeleccionado!: Customer; // Cliente seleccionado para la venta
  status: string = "pendiente"; // Estado de la venta
  totalPagar: number = 0; // Total a pagar en la venta

  formularioProductoVenta: FormGroup; // Formulario para agregar productos
  columnasTabla: string[] = ['Producto', 'Cantidad', 'Precio', 'Total', 'Accion']; // Columnas de la tabla
  datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta); // Datos de la tabla

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService,
    private _clienteService: ClienteService
  ) {
    // Inicializa el formulario con validaciones
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cliente: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtiene la lista de productos activos y con stock
    this._productoService.ListaProductos().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.active && p.stock > 0);
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadService.mostrarAlerta("Error al cargar productos");
      }
    });

    // Filtra productos según la búsqueda del usuario
    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });

    // Obtiene la lista de clientes activos
    this._clienteService.ListaClientes().subscribe({
      next: (data) => {
        if (data.status) {
          const listaC = data.value as Customer[];
          this.listaClientes = listaC.filter(c => c.active);
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadService.mostrarAlerta("Error al cargar clientes");
      }
    });

    // Filtra clientes según la búsqueda del usuario
    this.formularioProductoVenta.get('cliente')?.valueChanges.subscribe(value => {
      this.listaClientesFiltro = this.retornarClienteFiltro(value);
    });
  }

  // Filtra productos por nombre
  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.name.toLowerCase();
    return this.listaProductos.filter(item => item.name.toLowerCase().includes(valorBuscado));
  }

  // Filtra clientes por nombre
  retornarClienteFiltro(busqueda: any): Customer[] {
    const clienteBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.name.toLowerCase();
    return this.listaClientes.filter(item => item.name.toLowerCase().includes(clienteBuscado));
  }

  // Muestra el nombre del producto en el autocompletado
  mostrarProducto(producto: Producto): string {
    return producto.name;
  }

  // Muestra el nombre del cliente en el autocompletado
  mostrarCliente(customer: Customer): string {
    return customer.name;
  }

  // Asigna el producto seleccionado
  productoParaVenta(event: any): void {
    this.productoSeleccionado = event.option.value;
  }

  // Asigna el cliente seleccionado
  clienteRegistrarVenta(event: any): void {
    this.clienteSeleccionado = event.option.value;
  }

  // Agrega un producto a la lista de venta
  agregarProductoVenta(): void {
    const cantidad: number = this.formularioProductoVenta.value.cantidad;
    const productoOriginal = this.listaProductos.find(p => p.id === this.productoSeleccionado.id);

    if (!productoOriginal) {
      this._utilidadService.mostrarError( 'Hubo un error al obtener el producto .');
      return;
    }

    const stockDisponible = productoOriginal.stock;

    if (cantidad > stockDisponible) {
      this._utilidadService.mostrarError( `Stock Insuficiente Solo tienes ${stockDisponible} unidades de ${this.productoSeleccionado.name}.`);
      return;
    }

    const precio: number = parseFloat(this.productoSeleccionado.price);
    const subtotal: number = cantidad * precio;
    this.totalPagar += subtotal;

    this.listaProductosVenta.push({
      id: this.productoSeleccionado.id,
      name: this.productoSeleccionado.name,
      quantity: cantidad,
      price: precio.toFixed(2),
      subtotal: parseFloat(subtotal.toFixed(2))
    });

    this.datosDetalleVenta.data = this.listaProductosVenta;
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    });
  }

  // Elimina un producto de la lista de venta
  eliminarProducto(detalleVenta: DetalleVenta): void {
    this.totalPagar -= detalleVenta.subtotal;
    this.listaProductosVenta = this.listaProductosVenta.filter(p => p.name !== detalleVenta.name);
    this.datosDetalleVenta.data = this.listaProductosVenta;
  }

  // Modifica la cantidad de un producto en la lista de venta
  modificarCantidad(element: DetalleVenta, operacion: number): void {
    const productoOriginal = this.listaProductos.find(p => p.id === element.id);

    if (!productoOriginal) {
      this._utilidadService.mostrarError( 'Hubo un error al obtener el producto.');
      return;
    }

    const stockDisponible = productoOriginal.stock;
    const nuevaCantidad = element.quantity + operacion;

    if (nuevaCantidad < 1) {
      this._utilidadService.mostrarError('La cantidad no puede ser menor que 1.');
      return;
    }

    if (nuevaCantidad > stockDisponible) {
      this._utilidadService.mostrarError(`Solo tienes ${stockDisponible} unidades de ${element.name}.`);
      return;
    }

    element.quantity = nuevaCantidad;
    element.subtotal = parseFloat((element.quantity * parseFloat(element.price)).toFixed(2));
    this.totalPagar = this.listaProductosVenta.reduce((total, producto) => total + producto.subtotal, 0);
    this.datosDetalleVenta.data = this.listaProductosVenta;
  }

  // Registra la venta en el sistema
  registrarVenta(): void {
    if (!this.clienteSeleccionado) {
      this._utilidadService.mostrarError('Por favor, selecciona un cliente antes de registrar la venta.');
      return;
    }

    if (this.listaProductosVenta.length === 0) {
      this._utilidadService.mostrarError( 'Venta vacia No hay productos en la venta.');
      return;
    }

    this.bloquearBotonRegistrar = true;

    const request: Venta = {
      status: this.status,
      total: this.totalPagar,
      order_date: new Date().toISOString(),
      customer_id: this.clienteSeleccionado.id,
      products: this.listaProductosVenta.map(product => ({
        id: product.id,
        quantity: product.quantity,
        price: product.price,
        subtotal: product.subtotal
      }))
    };

    this._ventaService.RegistrarVenta(request).subscribe({
      next: (response) => {
        if (response.status) {
          this.totalPagar = 0.00;
          this.listaProductosVenta = [];
          this.datosDetalleVenta.data = this.listaProductosVenta;

          this._utilidadService.mostrarExito( `Venta Registrada Número de Venta ${response.value.order_id}`);
        } else {
          this._utilidadService.mostrarError('No se pudo realizar el registro de la venta.');
        }
      },
      complete: () => {
        this.bloquearBotonRegistrar = false;

      },
      error: (e) => {
        console.error(e);
        this._utilidadService.mostrarError('Ocurrió un error al registrar la venta.');
      }
    });
  }
}
