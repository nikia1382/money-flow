import { CommonModule } from '@angular/common';
import {  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, X } from 'lucide-angular';

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
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    LucideAngularModule
  ],
  templateUrl: './add-goal-modal.html',
  styleUrl: './add-goal-modal.scss'
})
export class AddGoalModal implements OnChanges {

  @Input() isOpen = false;
@Input() mode: 'add' | 'edit' = 'add';
@Input() goal: GoalFormValue | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<GoalFormValue>();
  

  readonly X = X;

  readonly categories = [
    'Savings',
    'Travel',
    'Technology',
    'Education',
    'Home',
    'Health',
    'Other'
  ];

  goalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      targetAmount: [null, [Validators.required, Validators.min(1)]],
      savedAmount: [0, [Validators.required, Validators.min(0)]],
      deadline: ['', [Validators.required]]
    });
  }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['goal'] && this.goal) {
    this.goalForm.patchValue(this.goal);
  }
}
  closeModal(): void {
    this.goalForm.reset({
      title: '',
      category: '',
      targetAmount: null,
      savedAmount: 0,
      deadline: ''
    });

    this.close.emit();
  }

  submit(): void {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.goalForm.getRawValue());
    this.closeModal();
  }
}