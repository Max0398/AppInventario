import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/Interfaces/producto';
import { Categoria } from 'src/app/Interfaces/categoria';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-productos-card',
  templateUrl: './productos-card.component.html',
  styleUrls: ['./productos-card.component.css'],
  standalone: false,
})
export class ProductosCardComponent implements OnInit {
  // Variables para los productos
  dataInicio: Producto[] = [];
  filteredProducts: Producto[] = []; // Productos filtrados

  // Variables para los filtros
  searchText: string = '';
  selectedCategory: string = '';

  // Variables para la paginación
  pageSize = 10; // Cantidad de productos por página
  pageIndex = 0; // Página actual
  pagedProducts: Producto[] = []; // Productos paginados

  // Lista de categorías
  categories: Categoria[] = [];

  constructor(
    private _productoService: ProductoService,
    private _categoriaService: CategoriaService,
    private _utilidadService: UtilidadService
  ) {}

  // Método para obtener los productos
  obtenerProductos() {
    this._productoService.ListaProductos().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataInicio = data.value;
          this.filteredProducts = data.value; // Inicializa los productos filtrados
          this.aplicarFiltros(); // Aplica los filtros iniciales
        } else {
          this._utilidadService.mostrarAlerta('No se Encontraron Datos');
        }
      },
      error: (e) => {
        this._utilidadService.mostrarError('Error al obtener productos');
      },
    });
  }

  // obtener las categorías
  obtenerCategorias() {
    this._categoriaService.ListaCategorias().subscribe({
      next: (data) => {
        if (data.status) {
          this.categories = data.value;
        } else {
          this._utilidadService.mostrarAlerta('No se Encontraron Categorías');
        }
      },
      error: (e) => {
        this._utilidadService.mostrarError('Error al obtener categorías');
      },
    });
  }

  //aplicar los filtros
  aplicarFiltros() {
    this.filteredProducts = this.dataInicio.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? product.description === this.selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
    this.updatePagedProducts(); // Actualizar los productos paginados
  }

  // Actualiza los productos paginados
  updatePagedProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  //maneja el cambio de página
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProducts();
  }

  // Llamar a obtenerProductos y obtenerCategorias al iniciar el componente
  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
  }
}
