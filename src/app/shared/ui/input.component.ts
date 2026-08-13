import {
  Component,
  input,
  forwardRef,
  signal,
  HostBinding,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'nx-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    @if (label()) {
      <label [for]="inputId" class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
        {{ label() }}
      </label>
    }
    <input
      [id]="inputId"
      [type]="type()"
      [placeholder]="placeholder()"
      [value]="value()"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="error() ? inputId + '-error' : null"
      class="w-full px-4 py-3 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-input border-0 text-base font-sans transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30 focus:bg-white dark:focus:bg-dark-surface-high"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
    @if (error()) {
      <p [id]="inputId + '-error'" class="mt-1.5 text-sm text-red-500" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  error = input<string>('');

  protected inputId = `nx-input-${nextId++}`;
  protected value = signal('');
  protected disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
