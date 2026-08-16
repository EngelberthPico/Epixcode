import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL } from '../../shared/social-links.constants';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjybabqw';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  protected readonly instagramUrl = INSTAGRAM_URL;
  protected readonly facebookUrl = FACEBOOK_URL;
  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
    _gotcha: [''],
  });

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitError = signal(false);

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(false);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(this.form.getRawValue()),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        this.submitted.set(true);
        this.form.reset();
      } else {
        this.submitError.set(true);
      }
    } catch {
      this.submitError.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
