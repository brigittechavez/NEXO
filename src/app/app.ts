import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './shared/ui/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private readonly seo = inject(SeoService);

  constructor() {
    // Root is the only place that knows every navigation happens under it.
    this.seo.init();
  }
}
