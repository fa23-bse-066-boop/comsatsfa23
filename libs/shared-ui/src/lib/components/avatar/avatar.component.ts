import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <span class="inline-grid place-items-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700" [class]="sizeClass">
      @if (src) {
        <img [src]="src" [alt]="name" class="h-full w-full object-cover" loading="lazy" />
      } @else {
        {{ initials }}
      }
    </span>
  `,
})
export class AvatarComponent {
  @Input() name = 'DCMS';
  @Input() src = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  get sizeClass(): string {
    return { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' }[this.size];
  }
}
