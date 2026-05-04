import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./features/components/nav-bar/nav-bar.component";


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet , NavBarComponent],
  templateUrl:'./app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Search_Matrial');
}
