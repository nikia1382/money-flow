import { Component } from '@angular/core';
import { Crown, LucideAngularModule } from 'lucide-angular';

import { StateView } from '../../../../shared/components/state-view/state-view';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [LucideAngularModule, StateView, TranslatePipe],
  templateUrl: './premium.html',
  styleUrl: './premium.scss',
})
export class Premium {
  readonly Crown = Crown;
}
