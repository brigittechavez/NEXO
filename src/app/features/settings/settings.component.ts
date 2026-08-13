import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <h1>Configuración</h1>
      <p>Administra tu cuenta y preferencias</p>
    </div>
  `,
  styles: [`
    .settings {
      padding: 2rem;
    }
    h1 {
      margin-bottom: 1rem;
    }
  `]
})
export class SettingsComponent {}
