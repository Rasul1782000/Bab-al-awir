import { Component, computed, input } from "@angular/core";
import { PAGE_HEROES, HeroConfig } from "../../core/hero.config";

@Component({
  selector: "app-page-hero",
  standalone: false,
  templateUrl: "./page-hero.html",
  styleUrl: "./page-hero.scss",
})
export class PageHero {
  key = input<string>("");
  title = input<string>("");
  subtitle = input<string>("");
  eyebrow = input<string>("");
  image = input<string>("");
  cta = input<string>("");
  ctaLink = input<string | null>(null);

  private cfg = computed(() => {
    const k = this.key();
    return k ? ((PAGE_HEROES as unknown) as Record<string, HeroConfig | undefined>)[k] ?? null : null;
  });
  private effTitle = computed(() => this.title() || this.cfg()?.title || "");
  private effSubtitle = computed(() => this.subtitle() || this.cfg()?.subtitle || "");
  private effEyebrow = computed(() => this.eyebrow() || this.cfg()?.eyebrow || "");
  private effImage = computed(() => this.image() || this.cfg()?.image || "");
  private effCta = computed(() => this.cta() || this.cfg()?.cta || "");
  private effCtaLink = computed(() => this.ctaLink() ?? this.cfg()?.ctaLink ?? null);

  resolvedTitle = computed(() => this.effTitle());
  resolvedSubtitle = computed(() => this.effSubtitle());
  resolvedEyebrow = computed(() => this.effEyebrow());
  resolvedImage = computed(() => this.effImage());
  resolvedCta = computed(() => this.effCta());
  resolvedCtaLink = computed(() => this.effCtaLink());
}
