import { Component, inject } from '@angular/core';

import {
  LucideAngularModule,
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from 'lucide-angular';

import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  readonly toastService = inject(ToastService);

  readonly CheckCircle2 = CheckCircle2;

  readonly CircleAlert = CircleAlert;

  readonly Info = Info;

  readonly TriangleAlert = TriangleAlert;

  readonly X = X;

  getIcon(type: 'success' | 'error' | 'info' | 'warning') {
    switch (type) {
      case 'success':
        return this.CheckCircle2;

      case 'error':
        return this.CircleAlert;

      case 'warning':
        return this.TriangleAlert;

      default:
        return this.Info;
    }
  }
}
