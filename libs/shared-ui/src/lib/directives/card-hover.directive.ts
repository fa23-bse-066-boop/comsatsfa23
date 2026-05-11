import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCardHover]',
  standalone: true,
})
export class CardHoverDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-4px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'var(--shadow-raised)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', '200ms ease-out');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'var(--shadow-md)');
  }
}
