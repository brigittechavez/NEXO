import { Directive, Input, ElementRef, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { isBrowser, isReducedMotion, initGsap } from './motion.utils';

type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Reveal flavour.
 *
 * `slide` — the default: fades in while translating.
 * `clip`  — an editorial mask wipe; the element is uncovered rather than moved.
 * `scale` — settles outward from slightly smaller.
 *
 * Having more than one keeps a long public page from animating every section
 * the same way (§73).
 *
 * Note on full-bleed elements: `slide` with a horizontal direction translates
 * the element sideways, which on a section spanning the viewport shows up as
 * horizontal overflow (or a strip of empty space) for as long as the element
 * is waiting to be revealed. Use `clip` for a horizontal feel on sections, and
 * keep `slide` horizontals for content that sits inside a container.
 */
type Variant = 'slide' | 'clip' | 'scale';

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 60 },
  down: { x: 0, y: -60 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

const clipFrom: Record<Direction, string> = {
  up: 'inset(100% 0 0 0)',
  down: 'inset(0 0 100% 0)',
  left: 'inset(0 0 0 100%)',
  right: 'inset(0 100% 0 0)',
};

@Directive({
  selector: '[scrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() direction: Direction = 'up';
  @Input() variant: Variant = 'slide';
  @Input() delay = 0;
  @Input() duration = 0.8;

  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (!isBrowser() || isReducedMotion()) return;
    void this.animate();
  }

  private async animate(): Promise<void> {
    const { gsap, ScrollTrigger } = await initGsap();
    if (!gsap || !ScrollTrigger) return;

    const element = this.el.nativeElement;
    const offset = directionOffsets[this.direction];

    this.ctx = gsap.context(() => {
      const from: gsap.TweenVars = { opacity: 0 };
      const to: gsap.TweenVars = {
        opacity: 1,
        duration: this.duration,
        delay: this.delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      };

      switch (this.variant) {
        case 'clip':
          from['clipPath'] = clipFrom[this.direction];
          to['clipPath'] = 'inset(0 0 0 0)';
          to['ease'] = 'power2.inOut';
          break;
        case 'scale':
          // Settles outward, never inward. Starting above 1 makes a full-width
          // section wider than the viewport and pushes the document sideways
          // until the tween finishes.
          from['scale'] = 0.96;
          to['scale'] = 1;
          break;
        default:
          from['x'] = offset.x;
          from['y'] = offset.y;
          to['x'] = 0;
          to['y'] = 0;
      }

      gsap.set(element, from);
      gsap.to(element, to);
    }, element);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
