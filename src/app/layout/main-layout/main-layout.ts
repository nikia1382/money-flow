import { Component, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Toast } from '../../shared/components/toast/toast';
@Component({
  selector: 'app-main-layout',

  imports: [RouterOutlet, Sidebar, Header, Toast],

  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  readonly isSidebarOpen = signal(false);

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }
}
