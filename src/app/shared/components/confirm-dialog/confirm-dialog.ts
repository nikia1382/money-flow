import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'primary';

@Component({
  selector: 'app-confirm-dialog',

  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  /* =========================
     Content
  ========================= */

  @Input()
  title = 'Are you sure?';

  @Input()
  message = 'This action cannot be undone.';

  /* =========================
     Buttons
  ========================= */

  @Input()
  confirmText = 'Confirm';

  @Input()
  cancelText = 'Cancel';

  /* =========================
     Appearance
  ========================= */

  @Input()
  variant: ConfirmDialogVariant = 'danger';

  /* =========================
     Events
  ========================= */

  @Output()
  confirm = new EventEmitter<void>();

  @Output()
  cancel = new EventEmitter<void>();

  /* =========================
     Actions
  ========================= */

  confirmAction(): void {
    this.confirm.emit();
  }

  cancelAction(): void {
    this.cancel.emit();
  }
}
