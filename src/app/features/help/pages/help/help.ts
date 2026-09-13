import { Component, inject } from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';

import {
  LucideAngularModule,
  Search,
  WalletCards,
  ArrowLeftRight,
  ChartNoAxesColumnIncreasing,
  Languages,
  Palette,
  CircleHelp,
  Mail,
  ChevronDown,
  LucideIconData,
} from 'lucide-angular';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SupportRequestService } from '../../services/support-request';
import { ToastService } from '../../../../shared/services/toast';
import { CreateSupportRequest } from '../../models/support-request.model';

interface HelpTopic {
  id: number;
  titleKey: string;
  descriptionKey: string;
icon: LucideIconData;}

interface HelpFaq {
  id: number;
  questionKey: string;
  answerKey: string;
  searchText: string;
}

@Component({
  selector: 'app-help',

  standalone: true,

  imports: [FormsModule, LucideAngularModule, TranslatePipe],

  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {
  /* =========================
     Icons
  ========================= */
private readonly supportRequestService =
  inject(SupportRequestService);

private readonly toastService =
  inject(ToastService);

private readonly translate =
  inject(TranslateService);

supportRequest: CreateSupportRequest = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

isSubmittingSupport = false;

submitSupportRequest(
  form: NgForm,
): void {
  if (
    form.invalid ||
    this.isSubmittingSupport
  ) {
    form.control.markAllAsTouched();

    return;
  }

  this.isSubmittingSupport = true;

  this.supportRequestService
    .createRequest(
      this.supportRequest,
    )
    .subscribe({
      next: () => {
this.toastService.show(
  this.translate.instant(
    'help.support.toast.success',
  ),
  'success',
);

        form.resetForm({
          name: '',
          email: '',
          subject: '',
          message: '',
        });

        this.isSubmittingSupport = false;
      },

      error: (
        error: HttpErrorResponse,
      ) => {
        console.error(
          'Failed to submit support request',
          error,
        );

this.toastService.show(
  this.translate.instant(
    'help.support.toast.error',
  ),
  'error',
);

        this.isSubmittingSupport = false;
      },
    });
}
  readonly Search = Search;

  readonly Mail = Mail;

  readonly ChevronDown = ChevronDown;

  /* =========================
     State
  ========================= */

  searchTerm = '';

  openedFaqId: number | null = null;

  /* =========================
     Topics
  ========================= */

  readonly topics: HelpTopic[] = [
    {
      id: 1,

      titleKey: 'help.topics.gettingStarted.title',

      descriptionKey: 'help.topics.gettingStarted.description',

      icon: CircleHelp,
    },

    {
      id: 2,

      titleKey: 'help.topics.accounts.title',

      descriptionKey: 'help.topics.accounts.description',

      icon: WalletCards,
    },

    {
      id: 3,

      titleKey: 'help.topics.transactions.title',

      descriptionKey: 'help.topics.transactions.description',

      icon: ArrowLeftRight,
    },

    {
      id: 4,

      titleKey: 'help.topics.budgets.title',

      descriptionKey: 'help.topics.budgets.description',

      icon: ChartNoAxesColumnIncreasing,
    },

    {
      id: 5,

      titleKey: 'help.topics.language.title',

      descriptionKey: 'help.topics.language.description',

      icon: Languages,
    },

    {
      id: 6,

      titleKey: 'help.topics.appearance.title',

      descriptionKey: 'help.topics.appearance.description',

      icon: Palette,
    },
  ];

  /* =========================
     FAQ
  ========================= */

  readonly faqs: HelpFaq[] = [
    {
      id: 1,

      questionKey: 'help.faq.items.addAccount.question',

      answerKey: 'help.faq.items.addAccount.answer',

      searchText: 'add account bank cash savings حساب افزودن بانکی نقدی پس انداز',
    },

    {
      id: 2,

      questionKey: 'help.faq.items.transactions.question',

      answerKey: 'help.faq.items.transactions.answer',

      searchText: 'transaction add edit delete تراکنش افزودن ویرایش حذف',
    },

    {
      id: 3,

      questionKey: 'help.faq.items.budgets.question',

      answerKey: 'help.faq.items.budgets.answer',

      searchText: 'budget spending limit بودجه هزینه سقف',
    },

    {
      id: 4,

      questionKey: 'help.faq.items.recurring.question',

      answerKey: 'help.faq.items.recurring.answer',

      searchText: 'recurring payment subscription پرداخت دوره ای اشتراک',
    },

    {
      id: 5,

      questionKey: 'help.faq.items.language.question',

      answerKey: 'help.faq.items.language.answer',

      searchText: 'language persian english فارسی انگلیسی زبان',
    },

    {
      id: 6,

      questionKey: 'help.faq.items.theme.question',

      answerKey: 'help.faq.items.theme.answer',

      searchText: 'dark light mode theme appearance دارک روشن تم',
    },
  ];

  /* =========================
     Filter
  ========================= */

  get filteredFaqs(): HelpFaq[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.faqs;
    }

    return this.faqs.filter((faq) => faq.searchText.toLowerCase().includes(search));
  }

  /* =========================
     Accordion
  ========================= */

  toggleFaq(id: number): void {
    this.openedFaqId = this.openedFaqId === id ? null : id;
  }
}
