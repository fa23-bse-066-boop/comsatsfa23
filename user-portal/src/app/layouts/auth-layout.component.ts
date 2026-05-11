import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="grid min-h-screen bg-slate-50 text-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="hidden bg-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <a routerLink="/" class="text-xl font-bold">DCMS</a>
        <div>
          <p class="mb-4 text-sm uppercase tracking-[0.2em] text-blue-200">Private savings circle</p>
          <h1 class="max-w-xl font-display text-5xl font-bold leading-tight">Your Money, Your Circle, Your Turn.</h1>
          <p class="mt-5 max-w-lg text-blue-100">A transparent rotating savings platform for verified members across Pakistan.</p>
        </div>
        <p class="text-sm text-blue-200">Bank-grade UX for community finance.</p>
      </section>
      <section class="flex items-center justify-center p-6">
        <div class="w-full max-w-md">
          <router-outlet></router-outlet>
        </div>
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {}
