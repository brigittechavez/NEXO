import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task, TaskStatus } from '../../core/models/goal.model';

function makeTask(status: TaskStatus = 'pending'): Task {
  return {
    id: 't-1',
    title: 'Completar curso de TypeScript',
    description: 'Terminar el módulo de genéricos',
    status,
    dueDate: new Date('2026-09-01'),
  };
}

describe('TaskCardComponent', () => {
  let fixture: ComponentFixture<TaskCardComponent>;

  async function render(status: TaskStatus = 'pending') {
    fixture = TestBed.createComponent(TaskCardComponent);
    fixture.componentRef.setInput('task', makeTask(status));
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    }).compileComponents();
  });

  it('shows the task title and description', async () => {
    const el = await render();

    expect(el.textContent).toContain('Completar curso de TypeScript');
    expect(el.textContent).toContain('Terminar el módulo de genéricos');
  });

  describe('status cycle', () => {
    it('moves pending → in_progress', async () => {
      const el = await render('pending');
      let emitted: { taskId: string; status: TaskStatus } | undefined;
      fixture.componentInstance.statusChange.subscribe(e => (emitted = e));

      el.querySelector('button')?.click();

      expect(emitted).toEqual({ taskId: 't-1', status: 'in_progress' });
    });

    it('moves in_progress → completed', async () => {
      const el = await render('in_progress');
      let emitted: { taskId: string; status: TaskStatus } | undefined;
      fixture.componentInstance.statusChange.subscribe(e => (emitted = e));

      el.querySelector('button')?.click();

      expect(emitted?.status).toBe('completed');
    });

    it('cycles completed back to pending so a mistake can be undone', async () => {
      const el = await render('completed');
      let emitted: { taskId: string; status: TaskStatus } | undefined;
      fixture.componentInstance.statusChange.subscribe(e => (emitted = e));

      el.querySelector('button')?.click();

      expect(emitted?.status).toBe('pending');
    });

    it('does not mutate the task itself — the parent owns the state', async () => {
      const task = makeTask('pending');
      fixture = TestBed.createComponent(TaskCardComponent);
      fixture.componentRef.setInput('task', task);
      await fixture.whenStable();

      (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

      expect(task.status).toBe('pending');
    });
  });

  describe('accessibility', () => {
    it('labels the checkbox according to what the click will do', async () => {
      const pending = await render('pending');
      expect(pending.querySelector('button')?.getAttribute('aria-label')).toBe(
        'Marcar como completada'
      );

      const done = await render('completed');
      expect(done.querySelector('button')?.getAttribute('aria-label')).toBe(
        'Marcar como pendiente'
      );
    });
  });

  describe('visual state', () => {
    it('strikes through a completed task', async () => {
      const el = await render('completed');
      expect(el.querySelector('h4')?.className).toContain('line-through');
    });

    it('does not strike through a pending task', async () => {
      const el = await render('pending');
      expect(el.querySelector('h4')?.className).not.toContain('line-through');
    });
  });
});
