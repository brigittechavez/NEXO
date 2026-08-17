import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/ui/logo.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { DemoBannerComponent } from '../../shared/ui/demo-banner.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, ButtonComponent, DemoBannerComponent],
  template: `
    <app-demo-banner />

    <div class="min-h-screen flex">
      <!-- Left: Form Panel -->
      <div class="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-white dark:bg-dark-bg lg:border-r border-surface dark:border-dark-surface-high">
        <div class="w-full max-w-md mx-auto">
          <!-- Logo -->
          <div class="mb-10">
            <a routerLink="/" class="inline-flex items-center gap-2">
              <app-logo variant="mark" [height]="36" alt="" />
              <span class="text-xl font-bold tracking-tight text-ink dark:text-dark-text">NEXO</span>
            </a>
          </div>

          <!-- Heading -->
          <h1 class="text-heading-lg font-bold text-ink dark:text-dark-text mb-2">
            {{ activeTab() === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta' }}
          </h1>
          <p class="text-muted-text dark:text-dark-muted mb-8">
            {{ activeTab() === 'login'
              ? 'Inicia sesion para continuar con tu camino de aprendizaje'
              : 'Unete a la comunidad y comienza a crecer' }}
          </p>

          <!-- Tab Toggle -->
          <div class="flex bg-surface dark:bg-dark-surface-high rounded-pill p-1 mb-8">
            <button
              (click)="setTab('login')"
              class="flex-1 py-2.5 px-4 text-sm font-semibold rounded-pill transition-all duration-200"
              [class]="activeTab() === 'login'
                ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm'
                : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'">
              Iniciar sesion
            </button>
            <button
              (click)="setTab('register')"
              class="flex-1 py-2.5 px-4 text-sm font-semibold rounded-pill transition-all duration-200"
              [class]="activeTab() === 'register'
                ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm'
                : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'">
              Crear cuenta
            </button>
          </div>

          <!-- Login Form -->
          @if (activeTab() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                  Correo electronico
                </label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="tu@email.com"
                  class="input-nexo"
                  [class.input-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  [attr.aria-invalid]="(loginForm.get('email')?.invalid && loginForm.get('email')?.touched) ? true : null"
                />
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <p class="mt-1.5 text-sm text-red-500">
                    @if (loginForm.get('email')?.errors?.['required']) {
                      El correo es obligatorio
                    } @else if (loginForm.get('email')?.errors?.['email']) {
                      Ingresa un correo valido
                    }
                  </p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                  Contrasena
                </label>
                <input
                  formControlName="password"
                  type="password"
                  placeholder="Tu contrasena"
                  class="input-nexo"
                  [class.input-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  [attr.aria-invalid]="(loginForm.get('password')?.invalid && loginForm.get('password')?.touched) ? true : null"
                />
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <p class="mt-1.5 text-sm text-red-500">
                    @if (loginForm.get('password')?.errors?.['required']) {
                      La contrasena es obligatoria
                    } @else if (loginForm.get('password')?.errors?.['minlength']) {
                      Minimo 6 caracteres
                    }
                  </p>
                }
              </div>

              <div class="flex justify-end">
                <a routerLink="/recuperar-contrasena" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
                  Olvidaste tu contrasena?
                </a>
              </div>

              @if (errorMessage()) {
                <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-input">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
                </div>
              }

              <nx-button
                variant="primary"
                size="lg"
                [disabled]="loginForm.invalid || isLoading()"
                (clicked)="onLogin()">
                @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                } @else {
                  Entrar
                }
              </nx-button>
            </form>
          }

          <!-- Register Form -->
          @if (activeTab() === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                  Nombre completo
                </label>
                <input
                  formControlName="name"
                  type="text"
                  placeholder="Tu nombre"
                  class="input-nexo"
                  [class.input-error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                  [attr.aria-invalid]="(registerForm.get('name')?.invalid && registerForm.get('name')?.touched) ? true : null"
                />
                @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                  <p class="mt-1.5 text-sm text-red-500">El nombre es obligatorio</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                  Correo electronico
                </label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="tu&#64;email.com"
                  class="input-nexo"
                  [class.input-error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                  [attr.aria-invalid]="(registerForm.get('email')?.invalid && registerForm.get('email')?.touched) ? true : null"
                />
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <p class="mt-1.5 text-sm text-red-500">
                    @if (registerForm.get('email')?.errors?.['required']) {
                      El correo es obligatorio
                    } @else if (registerForm.get('email')?.errors?.['email']) {
                      Ingresa un correo valido
                    }
                  </p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                    Contrasena
                  </label>
                  <input
                    formControlName="password"
                    type="password"
                    placeholder="Min. 6 caracteres"
                    class="input-nexo"
                    [class.input-error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    [attr.aria-invalid]="(registerForm.get('password')?.invalid && registerForm.get('password')?.touched) ? true : null"
                  />
                  @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                    <p class="mt-1.5 text-sm text-red-500">
                      @if (registerForm.get('password')?.errors?.['required']) {
                        Obligatoria
                      } @else if (registerForm.get('password')?.errors?.['minlength']) {
                        Min. 6 caracteres
                      }
                    </p>
                  }
                </div>
                <div>
                  <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                    Confirmar
                  </label>
                  <input
                    formControlName="confirmPassword"
                    type="password"
                    placeholder="Repite tu contrasena"
                    class="input-nexo"
                    [class.input-error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                    [attr.aria-invalid]="(registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) ? true : null"
                  />
                  @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                    <p class="mt-1.5 text-sm text-red-500">
                      @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                        Confirma tu contrasena
                      }
                    </p>
                  } @else if (registerForm.get('confirmPassword')?.value && registerForm.get('password')?.value !== registerForm.get('confirmPassword')?.value) {
                    <p class="mt-1.5 text-sm text-red-500">No coinciden</p>
                  }
                </div>
              </div>

              <!-- Role Selection -->
              <div>
                <label class="block text-sm font-medium text-ink dark:text-dark-text mb-3">
                  Quiero ser...
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    (click)="registerForm.patchValue({ role: 'mentee' })"
                    class="p-4 rounded-card-sm border-2 text-left transition-all duration-200"
                    [class]="registerForm.get('role')?.value === 'mentee'
                      ? 'border-nexo-violet bg-nexo-violet/5'
                      : 'border-surface dark:border-dark-surface-high hover:border-muted-text/30'">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                         [class]="registerForm.get('role')?.value === 'mentee' ? 'bg-nexo-violet text-white' : 'bg-surface dark:bg-dark-surface-high text-muted-text'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <p class="text-sm font-semibold text-ink dark:text-dark-text">Mentee</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted">Encontrar un mentor</p>
                  </button>
                  <button
                    type="button"
                    (click)="registerForm.patchValue({ role: 'mentor' })"
                    class="p-4 rounded-card-sm border-2 text-left transition-all duration-200"
                    [class]="registerForm.get('role')?.value === 'mentor'
                      ? 'border-nexo-violet bg-nexo-violet/5'
                      : 'border-surface dark:border-dark-surface-high hover:border-muted-text/30'">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                         [class]="registerForm.get('role')?.value === 'mentor' ? 'bg-nexo-violet text-white' : 'bg-surface dark:bg-dark-surface-high text-muted-text'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 010 7.75"></path>
                      </svg>
                    </div>
                    <p class="text-sm font-semibold text-ink dark:text-dark-text">Mentor</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted">Ser mentor de otros</p>
                  </button>
                </div>
                @if (registerForm.get('role')?.invalid && registerForm.get('role')?.touched) {
                  <p class="mt-2 text-sm text-red-500">Selecciona un rol</p>
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
                [disabled]="registerForm.invalid || isLoading() || registerForm.get('password')?.value !== registerForm.get('confirmPassword')?.value"
                (clicked)="onRegister()">
                @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                } @else {
                  Crear cuenta
                }
              </nx-button>
            </form>
          }

          <!-- Demo Access -->
          <div class="mt-8 pt-6 border-t border-surface dark:border-dark-surface-high">
            <p class="text-xs text-center text-muted-text dark:text-dark-muted mb-4 uppercase tracking-wider font-medium">
              Acceso rapido para demostracion
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="demoLogin('mentee')"
                [disabled]="isLoading()"
                class="group flex items-center gap-2 px-4 py-3 bg-surface/50 dark:bg-dark-surface-high/50 hover:bg-surface dark:hover:bg-dark-surface-high rounded-card-sm transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="w-8 h-8 rounded-full bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#63D8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-ink dark:text-dark-text">Mentee demo</p>
                  <p class="text-[10px] text-muted-text dark:text-dark-muted">Explorar mentores</p>
                </div>
              </button>
              <button
                (click)="demoLogin('mentor')"
                [disabled]="isLoading()"
                class="group flex items-center gap-2 px-4 py-3 bg-surface/50 dark:bg-dark-surface-high/50 hover:bg-surface dark:hover:bg-dark-surface-high rounded-card-sm transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="w-8 h-8 rounded-full bg-acid-lime/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9FF43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-ink dark:text-dark-text">Mentor demo</p>
                  <p class="text-[10px] text-muted-text dark:text-dark-muted">Ver panel mentor</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Footer Link -->
          <p class="mt-8 text-center text-sm text-muted-text dark:text-dark-muted">
            Al continuar, aceptas nuestros
            <a href="#" class="text-nexo-violet hover:text-electric-indigo font-medium">terminos</a>
            y
            <a href="#" class="text-nexo-violet hover:text-electric-indigo font-medium">politica de privacidad</a>
          </p>
        </div>
      </div>

      <!-- Right: Visual Panel -->
      <div class="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-nexo-violet via-electric-indigo to-nexo-violet items-center justify-center">
        <!-- Floating elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 left-16 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div class="absolute top-40 right-20 w-14 h-14 bg-electric-cyan/20 rounded-full animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute bottom-32 left-24 w-16 h-16 bg-acid-lime/15 rounded-full animate-pulse" style="animation-delay: 2s"></div>
          <div class="absolute bottom-20 right-16 w-24 h-24 bg-white/5 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
          <div class="absolute top-1/3 left-1/4 w-10 h-10 bg-soft-lavender/20 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center px-12 max-w-lg">
          <div class="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-card-lg flex items-center justify-center">
            <app-logo variant="mark" [height]="48" alt="" />
          </div>
          <h2 class="text-display-sm font-bold text-white mb-4 font-sans">
            Conecta. Aprende. Crece.
          </h2>
          <p class="text-lg text-white/80 leading-relaxed font-sans">
            Un espacio donde el conocimiento fluye entre mentores y mentees, impulsando el crecimiento profesional de ambos.
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 mt-12">
            <div>
              <p class="text-3xl font-bold text-white">500+</p>
              <p class="text-sm text-white/60 mt-1">Mentores</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">2k+</p>
              <p class="text-sm text-white/60 mt-1">Mentees</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">10k+</p>
              <p class="text-sm text-white/60 mt-1">Sesiones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  errorMessage = signal('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: ['mentee' as 'mentee' | 'mentor', Validators.required],
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'register') {
        this.activeTab.set('register');
      }
    });
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.errorMessage.set('');
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password } = this.loginForm.value;
      const result = await this.authService.login(email, password);

      if (result.success) {
        const role = this.authService.getUserRole();
        if (role === 'mentor') {
          this.router.navigate(['/dashboard/mentor']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.errorMessage.set(result.error);
      }
    } catch {
      this.errorMessage.set('Hubo un error al iniciar sesion. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage.set('Las contrasenas no coinciden.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { name, email, password, role } = this.registerForm.value;
      const result = await this.authService.register(name, email, password, role);

      if (result.success) {
        if (role === 'mentor') {
          this.router.navigate(['/onboarding/mentor']);
        } else {
          this.router.navigate(['/onboarding/mentee']);
        }
      } else {
        this.errorMessage.set(result.error);
      }
    } catch {
      this.errorMessage.set('Hubo un error al crear la cuenta. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async demoLogin(role: 'mentee' | 'mentor'): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Demo access always uses the local demo profiles, so recruiters can get in
      // regardless of whether Supabase credentials are configured.
      await this.authService.loginAsDemo(role);

      if (role === 'mentor') {
        this.router.navigate(['/dashboard/mentor']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch {
      this.errorMessage.set('Error al acceder al demo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
