import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

export type StateViewType = 'empty' | 'no-results' | 'error' | 'success' | 'locked' | 'coming-soon';

@Component({
  selector: 'app-state-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './state-view.html',
  styleUrl: './state-view.scss',
})
export class StateView {
  @Input() type: StateViewType = 'empty';

  @Input() title = '';
  @Input() description = '';

  @Input() actionLabel = '';
  @Input() secondaryActionLabel = '';

  @Input() icon: LucideIconData | null = null;

  @Input() compact = false;

  @Output() action = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  primaryAction(): void {
    this.action.emit();
  }

  secondaryActionClick(): void {
    this.secondaryAction.emit();
  }
}
