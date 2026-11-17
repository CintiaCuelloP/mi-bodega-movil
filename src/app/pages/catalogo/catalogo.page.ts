/**
 * =====================================================================
 *  pages/catalogo/catalogo.page.ts · Semana 02 · Componentes y EVENTOS
 * ---------------------------------------------------------------------
 *  Equivalencias con Android nativo (lo que dice el sílabo):
 *    View    (TextView, Button)       → componente Ionic (ion-label, ion-button)
 *    Layout  (LinearLayout, Grid)     → ion-grid / ion-row / ion-col, ion-list
 *    Widget  (Switch, Spinner, FAB)   → ion-toggle, ion-select, ion-fab
 *    Listener (setOnClickListener)    → evento (click), (ionInput), (ionChange)
 *
 *  Analogía: los componentes son las PIEZAS de LEGO; los eventos son los
 *  "botones" de cada pieza que, al presionarlos, hacen algo.
 * =====================================================================
 */
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel, IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar,
  IonBadge, IonIcon, IonFab, IonFabButton, IonModal, IonButton, IonInput, IonSelect, IonSelectOption,
  IonToggle, IonToast, IonAlert, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, star, close, save } from 'ionicons/icons';
import { Categoria, CATEGORIAS, Producto } from '../../models/producto';
import { PRODUCTOS_MOCK } from '../../data/productos.mock';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonAvatar, IonBadge, IonIcon, IonFab, IonFabButton, IonModal, IonButton, IonInput,
    IonSelect, IonSelectOption, IonToggle, IonToast, IonAlert, IonRefresher, IonRefresherContent,
    IonGrid, IonRow, IonCol, IonNote,
  ],
})
export class CatalogoPage {
  // ---------------- ESTADO (datos que cambian) ----------------
  // signal(): una "caja observada". Cuando cambia su valor, la pantalla se redibuja sola.
  productos = signal<Producto[]>([...PRODUCTOS_MOCK]);   // [...] copia la lista (no tocamos el original)
  texto = signal('');                                     // lo que se escribe en el buscador
  categoria = signal<'Todas' | Categoria>('Todas');       // segmento elegido

  categorias = CATEGORIAS;

  // computed(): un valor CALCULADO a partir de otros signals. Se recalcula solo cuando ellos cambian.
  filtrados = computed(() => {
    const t = this.texto().toLowerCase();
    return this.productos().filter((p) =>
      (this.categoria() === 'Todas' || p.categoria === this.categoria()) &&
      p.nombre.toLowerCase().includes(t));
  });
  totalStock = computed(() => this.filtrados().reduce((suma, p) => suma + p.stock, 0));
  valorInventario = computed(() => this.filtrados().reduce((s, p) => s + p.precio * p.stock, 0));

  // ---------------- Estado de la interfaz ----------------
  modalAbierto = false;                         // ion-modal con [isOpen]
  toastAbierto = false;
  mensajeToast = '';
  porEliminar: Producto | null = null;          // producto que espera confirmación en el alert

  /** Formulario del modal (enlazado con [(ngModel)]) */
  nuevo = { nombre: '', categoria: 'Abarrotes' as Categoria, precio: 0, stock: 0, destacado: false };

  /** Botones del ion-alert de confirmación */
  botonesAlerta = [
    { text: 'Cancelar', role: 'cancel' },
    { text: 'Eliminar', role: 'destructive', handler: () => this.eliminarConfirmado() },
  ];

  constructor() {
    addIcons({ add, trash, star, close, save });
  }

  // ---------------- MANEJADORES DE EVENTOS ----------------

  /** (ionInput) del buscador: se dispara con cada tecla */
  alBuscar(evento: CustomEvent): void {
    this.texto.set((evento.detail.value ?? '') as string);
  }

  /** (ionChange) del segmento: el usuario eligió otra categoría */
  alCambiarCategoria(evento: CustomEvent): void {
    this.categoria.set(evento.detail.value);
  }

  /** (ionRefresh): el usuario jaló la lista hacia abajo */
  alRefrescar(evento: CustomEvent): void {
    setTimeout(() => {                                  // simulamos que tarda un poco (como una red)
      this.productos.set([...PRODUCTOS_MOCK]);
      (evento.target as HTMLIonRefresherElement).complete();   // avisa a Ionic que terminó
      this.avisar('Catálogo restablecido');
    }, 800);
  }

  /** (click) del botón flotante: abre el modal con el formulario limpio */
  abrirModal(): void {
    this.nuevo = { nombre: '', categoria: 'Abarrotes', precio: 0, stock: 0, destacado: false };
    this.modalAbierto = true;
  }

  /** (click) en Guardar del modal */
  guardar(): void {
    if (this.nuevo.nombre.trim().length < 3 || this.nuevo.precio <= 0) {
      this.avisar('Completa el nombre (mín. 3 letras) y un precio mayor que 0');
      return;
    }
    const id = Math.max(0, ...this.productos().map((p) => p.id)) + 1;      // siguiente id
    // update(): recibe la lista actual y devuelve la NUEVA lista (no se modifica la anterior)
    this.productos.update((lista) => [{ id, ...this.nuevo, nombre: this.nuevo.nombre.trim() }, ...lista]);
    this.modalAbierto = false;
    this.avisar(`"${this.nuevo.nombre}" agregado`);
  }

  /** (click) en la opción "Eliminar" que aparece al deslizar el ítem */
  pedirEliminar(p: Producto, deslizable: IonItemSliding): void {
    deslizable.close();          // cierra el deslizamiento
    this.porEliminar = p;        // abre el alert ([isOpen]="porEliminar !== null")
  }

  eliminarConfirmado(): void {
    const p = this.porEliminar;
    if (!p) return;
    this.productos.update((lista) => lista.filter((x) => x.id !== p.id));
    this.avisar(`"${p.nombre}" eliminado`);
  }

  /** (ionChange) del toggle de destacado dentro de cada fila */
  alternarDestacado(p: Producto): void {
    this.productos.update((lista) => lista.map((x) => (x.id === p.id ? { ...x, destacado: !x.destacado } : x)));
  }

  /** Muestra un toast (mensaje corto que desaparece solo) */
  avisar(texto: string): void {
    this.mensajeToast = texto;
    this.toastAbierto = true;
  }

  /** Iniciales para el avatar: "Arroz extra" → "AE" */
  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
}
