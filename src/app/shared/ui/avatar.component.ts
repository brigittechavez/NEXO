import { Component, input, computed, signal, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-avatar',
  standalone: true,
  template: `
    @if (src() && !imgFailed()) {
      <img
        [src]="src()"
        [alt]="name() || 'Avatar'"
        class="w-full h-full object-cover rounded-full"
        (error)="imgFailed.set(true)"
      />
    }
    @if (!src() || imgFailed()) {
      <span
        class="flex items-center justify-center w-full h-full rounded-full bg-nexo-violet/10 text-nexo-violet font-semibold select-none"
        [class.text-xs]="size() === 'sm'"
        [class.text-sm]="size() === 'md'"
        [class.text-lg]="size() === 'lg'"
        [class.text-2xl]="size() === 'xl'"
      >
        {{ initials() }}
      </span>
    }
  `,
})
export class AvatarComponent {
  src = input<string>('');
  name = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  protected readonly imgFailed = signal(false);

  readonly initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  @HostBinding('class')
  get hostClasses(): string {
    const base =
      'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0';

    const sizeMap: Record<string, string> = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };

    return `${base} ${sizeMap[this.size()]}`.trim();
  }
}
