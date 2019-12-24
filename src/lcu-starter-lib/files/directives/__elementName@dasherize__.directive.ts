import { Directive, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ThemeColorPickerService } from '@lcu/common';

@Directive({
  selector: '[<%= dasherize(elementName) %>]'
})
export class <%= classify(elementName) %>Directive implements OnInit {

  private currentColor: string;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private themeService: ThemeColorPickerService
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.hoverEffect(this.getThemeColor(), 'underline');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hoverEffect('', 'initial');
  }

  public ngOnInit(): void {
    this.currentColor = this.getThemeColor();
  }

  private getThemeColor(): string {
    const theme = this.themeService.GetColorClass().value;
    return 'color-swatch-' + theme.substring(theme.indexOf('-') + 1, theme.lastIndexOf('-'));
  }

  private hoverEffect(color: string, decoration: string): void {
    const title = this.elRef.nativeElement.querySelector('.mat-card-title');
    this.renderer.setStyle(title, 'text-decoration', decoration);

    if (!color && this.currentColor) {
      this.renderer.removeClass(title, this.currentColor);
    } else if (color !== this.currentColor) {
      this.renderer.removeClass(title, this.currentColor);
    }

    if (color) {
      this.renderer.addClass(title, color);
      this.currentColor = color;
    }
  }

}
