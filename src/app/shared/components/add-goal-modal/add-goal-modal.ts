import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import {
  LucideAngularModule,
  X,
} from 'lucide-angular';

export interface GoalFormValue {
  title: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

@Component({
  selector: 'app-add-goal-modal',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule,
  ],

  templateUrl: './add-goal-modal.html',
  styleUrl: './add-goal-modal.scss',
})
export class AddGoalModal implements OnChanges {
  @Input()
  isOpen = false;

  @Input()
  mode: 'add' | 'edit' = 'add';

  @Input()
  goal: GoalFormValue | null = null;

  @Output()
  close = new EventEmitter<void>();

  @Output()
  save = new EventEmitter<GoalFormValue>();

  readonly X = X;

  readonly categories = [
    'savings',
    'travel',
    'technology',
    'education',
    'home',
    'health',
    'other',
  ];

  readonly goalForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
  ) {
    this.goalForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(80),
        ],
      ],

      category: [
        '',
        Validators.required,
      ],

      targetAmount: [
        null,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],

      savedAmount: [
        0,
        [
          Validators.required,
          Validators.min(0),
        ],
      ],

      deadline: [
        '',
        Validators.required,
      ],
    });
  }

  ngOnChanges(
    changes: SimpleChanges,
  ): void {
    if (
      changes['goal'] &&
      this.goal
    ) {
      this.goalForm.patchValue(
        this.goal,
      );
    }

    if (
      changes['isOpen'] &&
      this.isOpen &&
      this.mode === 'add'
    ) {
      this.resetForm();
    }
  }

  get isFormValid(): boolean {
    if (this.goalForm.invalid) {
      return false;
    }

    const targetAmount =
      Number(
        this.goalForm.get(
          'targetAmount',
        )?.value ?? 0,
      );

    const savedAmount =
      Number(
        this.goalForm.get(
          'savedAmount',
        )?.value ?? 0,
      );

    return (
      savedAmount <= targetAmount
    );
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

submit(): void {
  if (!this.isFormValid) {
    this.goalForm.markAllAsTouched();
    return;
  }

  const value = this.goalForm.getRawValue();

  const goal: GoalFormValue = {
    title: value.title,
    category: value.category,
    targetAmount: value.targetAmount,
    savedAmount: value.savedAmount,
    deadline: value.deadline,
  };

  this.save.emit(goal);

  this.closeModal();
}

  private resetForm(): void {
    this.goalForm.reset({
      title: '',
      category: '',
      targetAmount: null,
      savedAmount: 0,
      deadline: '',
    });
  }
}