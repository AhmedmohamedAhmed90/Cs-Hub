import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CS Learning Hub';
  sidebarOpen = false;
  darkMode = false;

  ngOnInit(): void {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
    }
    
    // Listen for changes to color scheme preferences
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.darkMode = e.matches;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }
}