import { TestBed } from '@angular/core/testing';
import { ProgressService, DEFAULT_PROGRESS_WEIGHTS } from './progress.service';
import { Milestone, Task, TaskStatus } from '../models/goal.model';

function milestones(...completed: boolean[]): Milestone[] {
  return completed.map((done, i) => ({
    id: `ms${i}`,
    title: `Hito ${i}`,
    completed: done,
    order: i,
  }));
}

function tasks(...statuses: TaskStatus[]): Task[] {
  return statuses.map((status, i) => ({
    id: `t${i}`,
    title: `Tarea ${i}`,
    description: '',
    status,
    dueDate: new Date('2026-01-01'),
  }));
}

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);
    service.resetWeights();
  });

  describe('weights', () => {
    it('defaults to 70% milestones / 30% tasks', () => {
      expect(service.getWeights()).toEqual(DEFAULT_PROGRESS_WEIGHTS);
      expect(DEFAULT_PROGRESS_WEIGHTS.milestones).toBe(70);
      expect(DEFAULT_PROGRESS_WEIGHTS.tasks).toBe(30);
    });

    it('allows weights to be overridden and reset', () => {
      service.setWeights({ milestones: 50, tasks: 50 });
      expect(service.getWeights()).toEqual({ milestones: 50, tasks: 50 });

      service.resetWeights();
      expect(service.getWeights()).toEqual(DEFAULT_PROGRESS_WEIGHTS);
    });
  });

  describe('calculateProgress', () => {
    it('returns 0 when there is nothing to track', () => {
      expect(service.calculateProgress([], [])).toBe(0);
    });

    it('returns 0 when nothing is completed', () => {
      expect(service.calculateProgress(milestones(false, false), tasks('pending', 'in_progress'))).toBe(0);
    });

    it('returns 100 when everything is completed', () => {
      expect(service.calculateProgress(milestones(true, true), tasks('completed', 'completed'))).toBe(100);
    });

    it('applies the 70/30 split', () => {
      // All milestones done, no tasks done -> 70
      expect(service.calculateProgress(milestones(true, true), tasks('pending', 'pending'))).toBe(70);
      // No milestones done, all tasks done -> 30
      expect(service.calculateProgress(milestones(false, false), tasks('completed', 'completed'))).toBe(30);
    });

    it('weights milestones above tasks so small tasks cannot inflate progress', () => {
      // 0/4 milestones but 8/8 tasks completed.
      const manyTasksDone = service.calculateProgress(
        milestones(false, false, false, false),
        tasks(...(Array(8).fill('completed') as TaskStatus[]))
      );
      // 2/4 milestones and no tasks completed.
      const someMilestonesDone = service.calculateProgress(
        milestones(true, true, false, false),
        tasks(...(Array(8).fill('pending') as TaskStatus[]))
      );

      expect(manyTasksDone).toBe(30);
      expect(someMilestonesDone).toBe(35);
      expect(someMilestonesDone).toBeGreaterThan(manyTasksDone);
    });

    it('computes a mixed case correctly', () => {
      // 1/2 milestones = 50% -> 35, 1/4 tasks = 25% -> 7.5, total 42.5 -> 43
      const result = service.calculateProgress(
        milestones(true, false),
        tasks('completed', 'pending', 'in_progress', 'pending')
      );
      expect(result).toBe(43);
    });

    it('scales to 100 when the goal only has milestones', () => {
      expect(service.calculateProgress(milestones(true, true, false, false), [])).toBe(50);
      expect(service.calculateProgress(milestones(true, true), [])).toBe(100);
    });

    it('scales to 100 when the goal only has tasks', () => {
      expect(service.calculateProgress([], tasks('completed', 'pending'))).toBe(50);
      expect(service.calculateProgress([], tasks('completed', 'completed'))).toBe(100);
    });

    it('honours custom weights', () => {
      service.setWeights({ milestones: 50, tasks: 50 });
      expect(service.calculateProgress(milestones(true, true), tasks('pending', 'pending'))).toBe(50);
    });

    it('treats in_progress tasks as not completed', () => {
      expect(service.calculateProgress([], tasks('in_progress', 'in_progress'))).toBe(0);
    });
  });

  describe('completion helpers', () => {
    it('computes milestone completion', () => {
      expect(service.milestoneCompletion(milestones(true, false, false, false))).toBe(25);
      expect(service.milestoneCompletion([])).toBe(0);
    });

    it('computes task completion', () => {
      expect(service.taskCompletion(tasks('completed', 'completed', 'pending', 'in_progress'))).toBe(50);
      expect(service.taskCompletion([])).toBe(0);
    });
  });

  describe('getBreakdown', () => {
    it('reports totals alongside the weighted result', () => {
      const breakdown = service.getBreakdown({
        milestones: milestones(true, true, false, false),
        tasks: tasks('completed', 'pending'),
      });

      expect(breakdown).toEqual({
        overall: 50, // 50% * 0.7 + 50% * 0.3
        milestones: 50,
        tasks: 50,
        completedMilestones: 2,
        totalMilestones: 4,
        completedTasks: 1,
        totalTasks: 2,
      });
    });
  });

  describe('currentMilestoneIndex', () => {
    it('points at the first incomplete milestone', () => {
      expect(service.currentMilestoneIndex(milestones(true, true, false, false))).toBe(2);
      expect(service.currentMilestoneIndex(milestones(false, false))).toBe(0);
    });

    it('returns -1 when every milestone is done', () => {
      expect(service.currentMilestoneIndex(milestones(true, true))).toBe(-1);
    });
  });
});
