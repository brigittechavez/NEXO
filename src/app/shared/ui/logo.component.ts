import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [attr.aria-label]="'NEXO logo'"
      role="img"
    >
      <!-- Outer flowing shape — suggests connection and motion -->
      <path
        d="M50 5 C72 5 90 18 95 38 C98 50 95 65 85 78 C75 88 62 95 50 95 C38 95 25 88 15 78 C5 65 2 50 5 38 C10 18 28 5 50 5Z"
        stroke="currentColor"
        [attr.stroke-width]="2.5"
        fill="none"
      />

      <!-- Inner negative space forming a subtle 'N' -->
      <path
        d="M35 30 L35 70 L55 30 L55 70"
        stroke="currentColor"
        [attr.stroke-width]="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        opacity="0.9"
      />

      <!-- Accent strokes suggesting movement -->
      <path
        d="M62 35 Q75 50 62 65"
        stroke="currentColor"
        [attr.stroke-width]="2.5"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
  `,
})
export class LogoComponent {
  @Input() size: number = 32;
}
