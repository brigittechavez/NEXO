import { Directive, Input, ElementRef, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { isBrowser, isReducedMotion } from './motion.utils';

@Directive({
  selector: '[magnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  @Input() strength: number = 0.3;

  private listeners: (() => void)[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    // Cursor-follow is decorative, so it is off under reduced motion, and it is
    // pointer-only: on touch there is no cursor to be magnetic towards (§72).
    if (!isBrowser() || isReducedMotion()) return;

    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const element = this.el.nativeElement;

    this.listeners.push(
      this.renderer.listen(element, 'mousemove', (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * this.strength;
        const deltaY = (e.clientY - centerY) * this.strength;

        this.renderer.setStyle(element, 'transform', `translate(${deltaX}px, ${deltaY}px)`);
        this.renderer.setStyle(element, 'transition', 'transform 0.3s ease-out');
      }),
    );

    this.listeners.push(
      this.renderer.listen(element, 'mouseleave', () => {
        this.renderer.setStyle(element, 'transform', 'translate(0, 0)');
        this.renderer.setStyle(element, 'transition', 'transform 0.5s ease-out');
      }),
    );
  }

  ngOnDestroy(): void {
    this.listeners.forEach((unlisten) => unlisten());
  }
}
