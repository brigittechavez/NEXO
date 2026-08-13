import { Directive, Input, ElementRef, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { isBrowser } from './motion.utils';

@Directive({
  selector: '[cursorTilt]',
  standalone: true,
})
export class CursorTiltDirective implements AfterViewInit, OnDestroy {
  @Input() intensity: number = 10;

  private listeners: (() => void)[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    if (!isBrowser()) return;

    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const element = this.el.nativeElement;

    this.listeners.push(
      this.renderer.listen(element, 'mousemove', (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -this.intensity;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * this.intensity;

        this.renderer.setStyle(
          element,
          'transform',
          `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        );
        this.renderer.setStyle(element, 'transition', 'transform 0.1s ease-out');
      }),
    );

    this.listeners.push(
      this.renderer.listen(element, 'mouseleave', () => {
        this.renderer.setStyle(element, 'transform', 'perspective(600px) rotateX(0) rotateY(0)');
        this.renderer.setStyle(element, 'transition', 'transform 0.5s ease-out');
      }),
    );
  }

  ngOnDestroy(): void {
    this.listeners.forEach((unlisten) => unlisten());
  }
}
