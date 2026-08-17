import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from '../../shared/ui/logo.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-off-white dark:bg-dark-bg px-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <app-logo variant="mark" [height]="36" alt="" />
            <span class="text-xl font-bold tracking-tight text-ink dark:text-dark-text">NEXO</span>
          </a>
        </div>

        @if (!emailSent()) {
          <div class="bg-white dark:bg-dark-surface rounded-card-lg p-8 shadow-soft-sm">
            <div class="text-center mb-8">
              <div class="w-14 h-14 mx-auto mb-4 bg-nexo-violet/10 rounded-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B4BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
              </div>
              <h1 class="text-heading-md font-bold text-ink dark:text-dark-text mb-2">
                Recuperar contrasena
              </h1>
              <p class="text-sm text-muted-text dark:text-dark-muted">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contrasena
              </p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                  Correo electronico
                </label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="tu&#64;email.com"
                  class="input-nexo"
                  [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched"
                  [attr.aria-invalid]="(form.get('email')?.invalid && form.get('email')?.touched) ? true : null"
                />
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <p class="mt-1.5 text-sm text-red-500">
                    @if (form.get('email')?.errors?.['required']) {
                      El correo es obligatorio
                    } @else if (form.get('email')?.errors?.['email']) {
                      Ingresa un correo valido
                    }
                  </p>
                }
              </div>

              @if (errorMessage()) {
                <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-input">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
                </div>
              }

              <nx-button
                variant="primary"
                size="lg"
                [disabled]="form.invalid || isLoading()"
                (clicked)="onSubmit()">
                @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                } @else {
                  Enviar enlace de recuperacion
                }
              </nx-button>
            </form>
          </div>
        } @else {
          <div class="bg-white dark:bg-dark-surface rounded-card-lg p-8 shadow-soft-sm text-center">
            <div class="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 class="text-heading-md font-bold text-ink dark:text-dark-text mb-2">
              Revisa tu correo
            </h2>
            <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
              Hemos enviado un enlace de recuperacion a <strong>{{ sentEmail() }}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <p class="text-xs text-muted-text dark:text-dark-muted mb-6">
              No recibiste el correo? Revisa tu carpeta de spam o intenta de nuevo.
            </p>
            <a routerLink="/login" class="btn-primary inline-flex">
              Volver al inicio de sesion
            </a>
          </div>
        }

        <p class="text-center mt-6">
          <a routerLink="/login" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors flex items-center justify-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al inicio de sesion
          </a>
        </p>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal('');
  emailSent = signal(false);
  sentEmail = signal('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const email = this.form.get('email')?.value as string;
      const result = await this.authService.requestPasswordReset(email);

      if (!result.success) {
        this.errorMessage.set(result.error);
        return;
      }

      this.sentEmail.set(email);
      this.emailSent.set(true);
    } catch {
      this.errorMessage.set('No se pudo enviar el correo. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
