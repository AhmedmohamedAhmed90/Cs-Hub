import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
} 