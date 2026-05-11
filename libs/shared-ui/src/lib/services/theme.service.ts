import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(localStorage.getItem('dcms_theme') === 'dark');

  constructor() {
    this.apply();
  }

  toggle(): void {
    this.isDark.update((value) => !value);
    localStorage.setItem('dcms_theme', this.isDark() ? 'dark' : 'light');
    this.apply();
  }

  private apply(): void {
    document.documentElement.dataset['theme'] = this.isDark() ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
