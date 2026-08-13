import { Directive, Input, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { isBrowser, isReducedMotion, initGsap } from './motion.utils';

@Directive({
  selector: '[staggerChildren]',
  standalone: true,
})
export class StaggerDirective implements AfterViewInit, OnDestroy {
  @Input() delay: number = 0.1;

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
    const children = element.children;

    if (!children.length) return;

    this.ctx = gsap.context(() => {
      gsap.from(children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: this.delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, element);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
