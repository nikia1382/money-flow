import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

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
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

interface HelpTopic {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: any;
}

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
