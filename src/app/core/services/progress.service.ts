import { Injectable } from '@angular/core';
import { Goal, Milestone, Task } from '../models/goal.model';

/**
 * Weighting for the overall goal progress.
 *
 * Milestones dominate on purpose: ticking off many small tasks should not
 * inflate progress when the real checkpoints of the journey are still pending.
 */
export interface ProgressWeights {
  milestones: number;
  tasks: number;
}

export const DEFAULT_PROGRESS_WEIGHTS: ProgressWeights = {
  milestones: 70,
  tasks: 30,
};

export interface ProgressBreakdown {
  /** Overall goal progress, 0–100. */
  overall: number;
  /** Milestone completion on its own, 0–100. */
  milestones: number;
  /** Task completion on its own, 0–100. */
  tasks: number;
  completedMilestones: number;
  totalMilestones: number;
  completedTasks: number;
  totalTasks: number;
}

/**
 * Single source of truth for progress maths.
 *
 * Every surface that shows progress (dashboard, progress view, workspace,
 * mentor views) must read from here so the number never disagrees with itself.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private weights: ProgressWeights = { ...DEFAULT_PROGRESS_WEIGHTS };

  getWeights(): ProgressWeights {
    return { ...this.weights };
  }

  setWeights(weights: Partial<ProgressWeights>): void {
    this.weights = { ...this.weights, ...weights };
  }

  resetWeights(): void {
    this.weights = { ...DEFAULT_PROGRESS_WEIGHTS };
  }

  /** Ratio of completed milestones as a 0–100 percentage. */
  milestoneCompletion(milestones: readonly Milestone[]): number {
    return this.percentage(milestones.filter(m => m.completed).length, milestones.length);
  }

  /** Ratio of completed tasks as a 0–100 percentage. */
  taskCompletion(tasks: readonly Task[]): number {
    return this.percentage(tasks.filter(t => t.status === 'completed').length, tasks.length);
  }

  /**
   * Weighted overall progress.
   *
   * When one dimension has no entries its weight is dropped and the remaining
   * dimension is scaled to 100, so a goal with only tasks can still reach 100%
   * instead of being capped at 30.
   */
  calculateProgress(milestones: readonly Milestone[], tasks: readonly Task[]): number {
    const hasMilestones = milestones.length > 0;
    const hasTasks = tasks.length > 0;

    if (!hasMilestones && !hasTasks) return 0;

    const { milestones: mWeight, tasks: tWeight } = this.weights;

    if (!hasTasks) return Math.round(this.milestoneCompletion(milestones));
    if (!hasMilestones) return Math.round(this.taskCompletion(tasks));

    const totalWeight = mWeight + tWeight;
    const weighted =
      (this.milestoneCompletion(milestones) * mWeight + this.taskCompletion(tasks) * tWeight) /
      totalWeight;

    return Math.round(weighted);
  }

  /** Full breakdown for progress UIs that show the split, not just the total. */
  getBreakdown(goal: Pick<Goal, 'milestones' | 'tasks'>): ProgressBreakdown {
    const { milestones, tasks } = goal;

    return {
      overall: this.calculateProgress(milestones, tasks),
      milestones: Math.round(this.milestoneCompletion(milestones)),
      tasks: Math.round(this.taskCompletion(tasks)),
      completedMilestones: milestones.filter(m => m.completed).length,
      totalMilestones: milestones.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      totalTasks: tasks.length,
    };
  }

  /**
   * Index of the milestone the mentee is working on right now: the first
   * incomplete one. Returns -1 when every milestone is done.
   */
  currentMilestoneIndex(milestones: readonly Milestone[]): number {
    return milestones.findIndex(m => !m.completed);
  }

  private percentage(completed: number, total: number): number {
    if (total <= 0) return 0;
    return (completed / total) * 100;
  }
}
