import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ArrowLeft,
  CircleDollarSign,
  Home,
  LucideAngularModule,
  TrendingUp,
  WalletCards,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private readonly router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly Home = Home;
  readonly WalletCards = WalletCards;
  readonly CircleDollarSign = CircleDollarSign;
  readonly TrendingUp = TrendingUp;

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    history.back();
  }
}
