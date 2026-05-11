import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './core/components/toast.component';

@Component({
  imports: [RouterModule, ToastComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
