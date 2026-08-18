import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ApiService } from "../../core/api.service";
import { LanguageService } from "../../core/language.service";
import { StoreLocation } from "../../core/models";

@Component({
  selector: "app-contact",
  standalone: false,
  templateUrl: "./contact.html",
  styleUrl: "./contact.scss",
})
export class Contact {
  private api = inject(ApiService);
  private langSvc = inject(LanguageService);
  lang = toSignal(this.langSvc.current$, { initialValue: this.langSvc.current });

  email = "care@babalawir.ae";
  phone = "+971 4 000 0000";
  stores = signal<StoreLocation[]>([]);

  contactName = signal("");
  contactEmail = signal("");
  contactPhone = signal("");
  contactSubject = signal("");
  contactMessage = signal("");
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal("");

  constructor() {
    this.api.getStoreLocations().subscribe((r) => this.stores.set(r.data ?? []));
  }

  submitContact(): void {
    if (!this.contactName() || !this.contactEmail() || !this.contactSubject() || !this.contactMessage()) {
      this.submitError.set("Please fill in all required fields");
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set("");
    this.submitSuccess.set(false);

    this.api.submitContact({
      name: this.contactName(),
      email: this.contactEmail(),
      phone: this.contactPhone() || undefined,
      subject: this.contactSubject(),
      message: this.contactMessage(),
    }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.submitSuccess.set(true);
          this.contactName.set("");
          this.contactEmail.set("");
          this.contactPhone.set("");
          this.contactSubject.set("");
          this.contactMessage.set("");
        } else {
          this.submitError.set(res.message || "Failed to send message. Please try again.");
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitError.set("Failed to send message. Please try again later.");
      }
    });
  }
}
