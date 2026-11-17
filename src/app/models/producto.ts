/**
 * models/producto.ts · "Molde" de un producto (interface de TypeScript)
 * ---------------------------------------------------------------------
 * Una interface NO guarda datos: describe la FORMA que deben tener.
 * Analogía: el formulario en blanco de una ficha; cada producto es una ficha llena.
 * Si escribes "precio: 'caro'" TypeScript te avisa: precio debe ser number.
 */
export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;        // en soles
  stock: number;
  destacado: boolean;
}

/** Tipo "unión": solo se permiten estos 4 textos exactos */
export type Categoria = 'Abarrotes' | 'Bebidas' | 'Lácteos' | 'Limpieza';

export const CATEGORIAS: Categoria[] = ['Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza'];
