import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

const KEY = "baw_region";

@Injectable({ providedIn: "root" })
export class RegionService {
  readonly current$ = new BehaviorSubject<string | null>(this.load());

  set(code: string): void {
    this.current$.next(code);
    try {
      localStorage.setItem(KEY, code);
    } catch {
      /* storage unavailable */
    }
  }

  get current(): string | null {
    return this.current$.value;
  }

  private load(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }
}
