import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MentorCardComponent } from './mentor-card.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { MENTOR_CARLOS } from '../../core/data/mentors.data';

describe('MentorCardComponent', () => {
  let fixture: ComponentFixture<MentorCardComponent>;
  let favorites: FavoritesService;

  async function render(options: { showMatch?: boolean; match?: number } = {}) {
    fixture = TestBed.createComponent(MentorCardComponent);
    fixture.componentRef.setInput('mentor', MENTOR_CARLOS);
    if (options.showMatch !== undefined) {
      fixture.componentRef.setInput('showMatch', options.showMatch);
    }
    if (options.match !== undefined) {
      fixture.componentRef.setInput('matchPercentage', options.match);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MentorCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    favorites = TestBed.inject(FavoritesService);
  });

  afterEach(() => localStorage.clear());

  it('leads with the mentor photo, name and title (§21)', async () => {
    const el = await render();

    expect(el.querySelector('img')?.getAttribute('alt')).toBe(MENTOR_CARLOS.name);
    expect(el.textContent).toContain(MENTOR_CARLOS.name);
    expect(el.textContent).toContain(MENTOR_CARLOS.title);
  });

  it('exposes the profile as a real link, so it is keyboard reachable', async () => {
    const el = await render();
    const link = el.querySelector('a');

    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toContain(MENTOR_CARLOS.id);
    expect(link?.textContent?.trim()).toBe(MENTOR_CARLOS.name);
  });

  it('does not add a second, dead control for the same destination', async () => {
    const el = await render();
    const buttons = el.querySelectorAll('button');

    // Only the bookmark toggle is a button; the hover CTA is decorative.
    expect(buttons.length).toBe(1);
  });

  describe('saving a mentor', () => {
    function saveButton(el: HTMLElement): HTMLButtonElement {
      return el.querySelector<HTMLButtonElement>('button[aria-label*="uardar"], button[aria-label*="uitar"]')!;
    }

    it('persists the mentor through FavoritesService', async () => {
      const el = await render();

      saveButton(el).click();

      expect(favorites.favorites()).toContain(MENTOR_CARLOS.id);
    });

    it('removes it again on a second click', async () => {
      const el = await render();

      saveButton(el).click();
      await fixture.whenStable();
      saveButton(el).click();

      expect(favorites.favorites()).not.toContain(MENTOR_CARLOS.id);
    });

    it('emits the mentor id so the page can report the outcome', async () => {
      const el = await render();
      let emitted: string | undefined;
      fixture.componentInstance.save.subscribe(id => (emitted = id));

      saveButton(el).click();

      expect(emitted).toBe(MENTOR_CARLOS.id);
    });

    it('reflects a mentor already saved elsewhere', async () => {
      favorites.toggleFavorite(MENTOR_CARLOS.id);
      const el = await render();

      expect(saveButton(el).getAttribute('aria-label')).toBe('Quitar de guardados');
    });

    it('describes the action for screen readers', async () => {
      const el = await render();
      expect(saveButton(el).getAttribute('aria-label')).toBe('Guardar mentor');
    });
  });

  describe('match', () => {
    it('shows the percentage when asked to', async () => {
      const el = await render({ showMatch: true, match: 94 });
      expect(el.textContent).toContain('94');
    });

    it('hides it by default, to keep the card uncluttered (§20)', async () => {
      const el = await render();
      expect(el.textContent).not.toContain('%');
    });
  });

  describe('free mentorship badge (§18)', () => {
    it('is shown for a mentor offering a free session', async () => {
      const el = await render();
      // MENTOR_CARLOS ships an introductory free session in the catalogue.
      expect(el.textContent).toContain('Gratuita');
    });
  });

  describe('mobile', () => {
    it('renders the essential information outside the hover layer (§21)', async () => {
      const el = await render();
      const mobileBlock = el.querySelector('.block.md\\:hidden');

      expect(mobileBlock).not.toBeNull();
      expect(mobileBlock?.textContent).toContain(MENTOR_CARLOS.name);
      expect(mobileBlock?.textContent).toContain(String(MENTOR_CARLOS.rating));
    });
  });
});
