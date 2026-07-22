import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from "@angular/core";

const FALLBACKS: Record<string, string> = {};

@Directive({
  selector: "[appBgImage]",
})
export class BgImageDirective implements OnChanges {
  @Input("appBgImage") src: string = "";
  @Input() bgFallback: string = "";
  @Input() bgGradient: string = "";

  private tried = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    this.tried = false;
    this.apply(this.src);
  }

  private fallbackFor(url: string): string {
    if (this.bgFallback) return this.bgFallback;
    for (const key of Object.keys(FALLBACKS)) {
      if (url.includes(key)) return FALLBACKS[key];
    }
    return "";
  }

  private apply(url: string): void {
    if (!url) return;
    const prefix = this.bgGradient ? `${this.bgGradient}, ` : "";
    const probe = new Image();
    probe.onload = () => this.renderer.setStyle(this.el.nativeElement, "background-image", `${prefix}url('${url}')`);
    probe.onerror = () => {
      if (this.tried) return;
      this.tried = true;
      const fb = this.fallbackFor(url);
      if (fb) this.apply(fb);
    };
    probe.src = url;
  }
}
