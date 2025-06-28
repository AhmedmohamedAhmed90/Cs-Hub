import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    MatBadgeModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [ResourceService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  resources: Resource[] = [];
  loading = true;
  error: string | null = null;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  
  // Chat-related properties
  activeChats: { userId: string; userName: string; lastMessage?: string }[] = [];
  showChatList = false;
  chatNotifications: string[] = [];

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResources();
    this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
    
    // Initialize chat connection and set up listeners
    this.initializeChatConnection();
    
    console.log('ROUTES:', this.router.config);
  }

  private initializeChatConnection(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.chatService.startConnection(token);
      
      // Subscribe to new chat notifications
      this.chatService.newChatStarted$.subscribe((otherUserId: string) => {
        console.log(`📢 New chat started with ${otherUserId}`);
        this.addChatNotification(otherUserId);
        this.addToActiveChats(otherUserId, 'Unknown User'); // We'll get the actual name later
      });

      // Subscribe to new messages
      this.chatService.messageReceived$.subscribe(({ senderId, message }) => {
        console.log(`📨 Message from ${senderId}: ${message}`);
        // Only update if this is a message from someone else
        if (senderId !== this.authService.getUserId()) {
          this.updateChatLastMessage(senderId, message);
          this.addChatNotification(senderId);
        }
      });

      // Subscribe to chat joined events
      this.chatService.chatJoined$.subscribe(({ otherUserId, roomId }) => {
        console.log(`✅ Chat joined with ${otherUserId} in room ${roomId}`);
        this.addToActiveChats(otherUserId, 'Unknown User');
      });
    }
  }

  private addChatNotification(userId: string): void {
    if (!this.chatNotifications.includes(userId)) {
      this.chatNotifications.push(userId);
      console.log(`🔔 Added notification for user: ${userId}`);
    }
  }

  private addToActiveChats(userId: string, userName: string): void {
    const existingChat = this.activeChats.find(chat => chat.userId === userId);
    if (!existingChat) {
      this.activeChats.push({ userId, userName });
    }
  }

  private updateChatLastMessage(userId: string, message: string): void {
    const chat = this.activeChats.find(c => c.userId === userId);
    if (chat) {
      chat.lastMessage = message;
    }
  }

  toggleChatList(): void {
    this.showChatList = !this.showChatList;
  }

  openChat(userId: string): void {
    this.chatNotifications = this.chatNotifications.filter(id => id !== userId);
    this.router.navigate(['/chat', userId]);
  }

  loadResources(): void {
    this.loading = true;
    this.resourceService.getApprovedResources().subscribe({
      next: (response: { resources: Resource[] }) => {
        this.resources = response.resources;
        console.log(this.resources[0])
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load resources';
        this.loading = false;
        console.error('Error loading resources:', err);
      }
    });
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  downloadFile(filePath: string): void {
    window.open(filePath, '_blank');
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Still perform local logout even if server request fails
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }

  isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  navigateToReviews(resourceId: number): void {
    this.router.navigate(['/reviews', resourceId]).then(success => {
      if (!success) {
        console.error('Navigation to reviews failed');
      }
    });
  }

  navigateToComments(resourceId: number): void {
    this.router.navigate(['/comments', resourceId]).then(success => {
      if (!success) {
        console.error('Navigation to comments failed');
      }
    });
  }

  onSearchChange(query: string): void {
    this.loading = true;
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.loadResources();
      return;
    }
    this.loading = true;
    this.resourceService.searchResources(query).subscribe({
      next: (response: { resources: Resource[] }) => {
        this.resources = response.resources;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to search resources';
        this.loading = false;
      }
    });
  }
  
  startChat(otherUserId: string) {
    // Check if we have a token and initialize connection if needed
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found');
      // Redirect to login or show error
      return;
    }

    // Ensure connection is established
    if (!this.chatService.isConnectionReady()) {
      console.log('🔄 Initializing SignalR connection...');
      this.chatService.startConnection(token);
    }

    // Join chat and navigate
    this.chatService.joinChatWithUser(otherUserId).then(() => {
      this.router.navigate(['/chat', otherUserId]);
    }).catch(err => {
      console.error('❌ Failed to start chat:', err);
      // You might want to show a user-friendly error message here
    });
  }
} 