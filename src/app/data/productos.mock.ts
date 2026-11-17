/**
 * data/productos.mock.ts · Datos de prueba ("mock" = de mentira)
 * Mientras no tengamos base de datos (semana 06) ni API (semana 07),
 * trabajamos con esta lista en memoria.
 */
import { Producto } from '../models/producto';

export const PRODUCTOS_MOCK: Producto[] = [
  { id: 1, nombre: 'Arroz extra 5 kg',       categoria: 'Abarrotes', precio: 22.9, stock: 15, destacado: true },
  { id: 2, nombre: 'Azúcar rubia 1 kg',      categoria: 'Abarrotes', precio: 4.2,  stock: 30, destacado: false },
  { id: 3, nombre: 'Aceite vegetal 1 L',     categoria: 'Abarrotes', precio: 9.5,  stock: 12, destacado: false },
  { id: 4, nombre: 'Leche evaporada 400 g',  categoria: 'Lácteos',   precio: 4.1,  stock: 48, destacado: true },
  { id: 5, nombre: 'Queso fresco 500 g',     categoria: 'Lácteos',   precio: 12.5, stock: 3,  destacado: false },
  { id: 6, nombre: 'Gaseosa 1.5 L',          categoria: 'Bebidas',   precio: 7.5,  stock: 20, destacado: true },
  { id: 7, nombre: 'Agua mineral 625 ml',    categoria: 'Bebidas',   precio: 1.5,  stock: 60, destacado: false },
  { id: 8, nombre: 'Detergente 800 g',       categoria: 'Limpieza',  precio: 8.9,  stock: 4,  destacado: false },
];
