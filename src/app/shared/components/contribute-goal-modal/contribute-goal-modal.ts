import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  FormsModule,
} from '@angular/forms';

import {
  LucideAngularModule,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-contribute-goal-modal',
  standalone: true,

  imports: [
    FormsModule,
    LucideAngularModule,
  ],

  templateUrl:
    './contribute-goal-modal.html',

  styleUrl:
    './contribute-goal-modal.scss',
})
export class ContributeGoalModal {
  @Input()
  isOpen = false;

  @Input()
  goalTitle = '';

  @Input()
  currentAmount = 0;

  @Input()
  targetAmount = 0;

  @Output()
  close =
    new EventEmitter<void>();

  @Output()
  contribute =
    new EventEmitter<number>();

  readonly X = X;

  amount: number | null = null;

  get remainingAmount(): number {
    return Math.max(
      0,
      this.targetAmount -
        this.currentAmount,
    );
  }

  get isValid(): boolean {
    return (
      this.amount !== null &&
      this.amount > 0 &&
      this.amount <=
        this.remainingAmount
    );
  }

  closeModal(): void {
    this.amount = null;

    this.close.emit();
  }

  submit(): void {
    if (
      !this.isValid ||
      this.amount === null
    ) {
      return;
    }

    this.contribute.emit(
      this.amount,
    );

    this.closeModal();
  }
}
