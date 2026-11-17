/**
 * =====================================================================
 *  pages/ciclo-vida/ciclo-vida.page.ts · Semana 02 · CICLO DE VIDA
 * ---------------------------------------------------------------------
 *  Una pantalla "nace", "aparece", "se oculta" y "muere". En cada momento
 *  Angular/Ionic llama a un método especial (hook) si lo escribimos.
 *
 *  Equivalencias con Android (Activity):
 *    onCreate   → constructor + ngOnInit      (nace: se crea UNA vez)
 *    onStart/onResume → ionViewWillEnter / ionViewDidEnter (cada vez que se muestra)
 *    onPause/onStop   → ionViewWillLeave / ionViewDidLeave (cada vez que se oculta)
 *    onDestroy  → ngOnDestroy                  (muere: se destruye)
 *  Y para TODA la app (va a segundo plano / vuelve): App.appStateChange
 *
 *  Analogía: un actor en el teatro. Nace al ser contratado (constructor),
 *  ensaya (ngOnInit), sale al escenario (ionViewDidEnter), se va tras bambalinas
 *  (ionViewDidLeave) y termina su contrato (ngOnDestroy).
 * =====================================================================
 */
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonNote, IonButton, IonCard, IonCardContent, IonBadge,
} from '@ionic/angular/standalone';
import { App } from '@capacitor/app';                   // plugin de Capacitor: eventos de la app completa
import type { PluginListenerHandle } from '@capacitor/core';

interface Evento { hook: string; hora: Date; color: string; }

@Component({
  selector: 'app-ciclo-vida',
  templateUrl: './ciclo-vida.page.html',
  imports: [DatePipe, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonNote, IonButton, IonCard, IonCardContent, IonBadge],
})
export class CicloVidaPage implements OnInit, OnDestroy {
  eventos = signal<Evento[]>([]);
  private oyente?: PluginListenerHandle;                // para poder dejar de escuchar al morir

  constructor() {
    this.registrar('constructor', 'medium');            // 1° en ejecutarse: la clase se crea
  }

  /** Se ejecuta UNA vez, cuando Angular terminó de preparar el componente. Ideal para cargar datos. */
  async ngOnInit(): Promise<void> {
    this.registrar('ngOnInit', 'primary');
    // Escuchamos si TODA la app pasa a segundo plano (minimizar, cambiar de pestaña) o vuelve
    this.oyente = await App.addListener('appStateChange', ({ isActive }) => {
      this.registrar(isActive ? 'App → primer plano (resume)' : 'App → segundo plano (pause)', 'warning');
    });
  }

  /** Ionic: la página está POR mostrarse (cada vez). Ideal para refrescar datos. */
  ionViewWillEnter(): void { this.registrar('ionViewWillEnter', 'secondary'); }

  /** Ionic: la página YA se muestra (terminó la animación). */
  ionViewDidEnter(): void { this.registrar('ionViewDidEnter', 'secondary'); }

  /** Ionic: la página está POR ocultarse (navegaste a otra). Ideal para pausar un video o el GPS. */
  ionViewWillLeave(): void { this.registrar('ionViewWillLeave', 'tertiary'); }

  /** Ionic: la página ya se ocultó. */
  ionViewDidLeave(): void { this.registrar('ionViewDidLeave', 'tertiary'); }

  /** Angular: la página se DESTRUYE. Liberamos recursos para no gastar memoria. */
  ngOnDestroy(): void {
    console.log('ngOnDestroy: la página se destruyó');
    this.oyente?.remove();                               // dejamos de escuchar el evento de la app
  }

  /** Agrega un evento al inicio de la lista y también a la consola (F12) */
  private registrar(hook: string, color: string): void {
    console.log(`[ciclo de vida] ${hook}`);
    this.eventos.update((lista) => [{ hook, hora: new Date(), color }, ...lista]);
  }

  limpiar(): void { this.eventos.set([]); }
}
