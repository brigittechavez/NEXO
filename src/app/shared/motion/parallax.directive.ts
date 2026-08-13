import { Directive, Input, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { isBrowser, isReducedMotion, initGsap } from './motion.utils';

@Directive({
  selector: '[parallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input() speed: number = 0.5;

  private ctx: gsap.Context | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (!isBrowser() || isReducedMotion()) return;

    this.animate();
  }

  private async animate(): Promise<void> {
    const { gsap, ScrollTrigger } = await initGsap();
    if (!gsap || !ScrollTrigger) return;

    const element = this.el.nativeElement;

    this.ctx = gsap.context(() => {
      gsap.to(element, {
        y: () => `${this.speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }, element);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
