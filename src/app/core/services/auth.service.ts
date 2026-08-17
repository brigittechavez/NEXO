import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../models/user.model';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.config';
import { DEMO_MENTEE, DEMO_MENTOR } from '../data/demo.data';

const DEMO_SESSION_KEY = 'nexo_demo_session';

export interface AuthResult {
  success: boolean;
  /** User-facing message, already in Spanish. Empty on success. */
  error: string;
}

const ok: AuthResult = { success: true, error: '' };
const fail = (error: string): AuthResult => ({ success: false, error });

/**
 * Authentication.
 *
 * Runs against **Supabase Auth** when credentials are configured
 * (`environment.supabase`). Without them it falls back to a clearly isolated
 * local demo adapter so the portfolio build stays clickable — same public API,
 * so no component needs to know which mode is active.
 *
 * See README → "Configuración de Supabase" for what to provide.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /** True when talking to a real Supabase project. */
  readonly usingSupabase = isSupabaseConfigured();

  constructor() {
    if (!this.isBrowser) return;

    if (this.usingSupabase) {
      void this.restoreSupabaseSession();
    } else {
      this.restoreDemoSession();
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const supabase = await getSupabaseClient();

    if (!supabase) return this.demoLogin(email);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return fail(this.translateError(error.message));
    if (!data.user) return fail('No pudimos iniciar tu sesión. Inténtalo de nuevo.');

    this.currentUser.set(await this.toUser(data.user));
    return ok;
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<AuthResult> {
    const supabase = await getSupabaseClient();

    if (!supabase) {
      const user: User = {
        id: `demo-${Date.now()}`,
        email,
        name,
        role,
        // No portrait for a brand-new account: nx-avatar falls back to initials,
        // which keeps the fallback inside the design system instead of depending
        // on an external avatar service.
        avatar: '',
        createdAt: new Date(),
      };
      this.setDemoSession(user);
      return ok;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });

    if (error) return fail(this.translateError(error.message));

    // With email confirmation enabled Supabase returns no session yet.
    if (data.user && data.session) {
      this.currentUser.set(await this.toUser(data.user));
    }

    return ok;
  }

  async logout(): Promise<void> {
    const supabase = await getSupabaseClient();

    if (supabase) {
      await supabase.auth.signOut();
    } else if (this.isBrowser) {
      try {
        localStorage.removeItem(DEMO_SESSION_KEY);
      } catch {
        // Nothing to clean up.
      }
    }

    this.currentUser.set(null);
  }

  /** Sends the Supabase recovery email. No-op message in demo mode. */
  async requestPasswordReset(email: string): Promise<AuthResult> {
    const supabase = await getSupabaseClient();

    if (!supabase) return ok;

    const redirectTo = this.isBrowser
      ? `${window.location.origin}/recuperar-contrasena`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    return error ? fail(this.translateError(error.message)) : ok;
  }

  /** One-click access for recruiters reviewing the portfolio. */
  async loginAsDemo(role: UserRole): Promise<AuthResult> {
    this.setDemoSession(role === 'mentor' ? DEMO_MENTOR : DEMO_MENTEE);
    return ok;
  }

  getUserRole(): UserRole | null {
    return this.currentUser()?.role ?? null;
  }

  /* ---------- demo adapter ---------- */

  private demoLogin(email: string): AuthResult {
    const user = email.includes('mentor') ? DEMO_MENTOR : DEMO_MENTEE;
    this.setDemoSession({ ...user, email });
    return ok;
  }

  private setDemoSession(user: User): void {
    this.currentUser.set(user);

    if (!this.isBrowser) return;
    try {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    } catch {
      // Session stays in memory for this tab only.
    }
  }

  private restoreDemoSession(): void {
    try {
      const stored = localStorage.getItem(DEMO_SESSION_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as User;
      this.currentUser.set({ ...parsed, createdAt: new Date(parsed.createdAt) });
    } catch {
      // Corrupt payload — start signed out.
    }
  }

  /* ---------- supabase ---------- */

  private async restoreSupabaseSession(): Promise<void> {
    const supabase = await getSupabaseClient();
    if (!supabase) return;

    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      this.currentUser.set(await this.toUser(data.session.user));
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      this.currentUser.set(session?.user ? await this.toUser(session.user) : null);
    });
  }

  /**
   * Map a Supabase auth user onto the app's `User`.
   *
   * Reads the `profiles` row when available, falling back to the metadata
   * captured at sign-up so the app still works before the profile row exists.
   */
  private async toUser(authUser: SupabaseUser): Promise<User> {
    const metadata = authUser.user_metadata ?? {};
    const supabase = await getSupabaseClient();

    let name = (metadata['name'] as string) ?? '';
    let role = (metadata['role'] as UserRole) ?? 'mentee';
    let avatar = (metadata['avatar'] as string) ?? '';

    if (supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role, avatar')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profile) {
        name = profile.name ?? name;
        role = (profile.role as UserRole) ?? role;
        avatar = profile.avatar ?? avatar;
      }
    }

    const displayName = name || authUser.email?.split('@')[0] || 'Usuario';

    return {
      id: authUser.id,
      email: authUser.email ?? '',
      name: displayName,
      role,
      // Empty when the profile has no picture; nx-avatar renders initials.
      avatar,
      createdAt: new Date(authUser.created_at),
    };
  }

  private translateError(message: string): string {
    const normalized = message.toLowerCase();

    if (normalized.includes('invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (normalized.includes('email not confirmed')) {
      return 'Confirma tu correo antes de entrar.';
    }
    if (normalized.includes('already registered') || normalized.includes('already exists')) {
      return 'Ya existe una cuenta con este correo.';
    }
    if (normalized.includes('password')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    return 'Algo salió mal. Inténtalo de nuevo.';
  }
}
