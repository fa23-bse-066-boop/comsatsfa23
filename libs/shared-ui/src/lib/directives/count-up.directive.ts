import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit {
  @Input() appCountUp = 0;
  @Input() duration = 2000;
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnInit() {
    this.animateCount(0, this.appCountUp, this.duration);
  }

  private animateCount(start: number, end: number, duration: number) {
    const startTime = Date.now();
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      this.el.nativeElement.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    updateCounter();
  }
}
