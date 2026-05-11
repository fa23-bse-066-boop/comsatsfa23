import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appSkeleton]',
  standalone: true,
})
export class SkeletonDirective {
  @Input() appSkeleton = false;

  @HostBinding('class.animate-pulse') get animate(): boolean {
    return this.appSkeleton;
  }

  @HostBinding('class.bg-slate-100') get surface(): boolean {
    return this.appSkeleton;
  }
}
