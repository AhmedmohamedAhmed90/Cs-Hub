import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
  otherUserId!: string;
  messageText = '';
  messages: { senderId: string; text: string }[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  async ngOnInit(): Promise<void> {
    this.otherUserId = this.route.snapshot.paramMap.get('userId')!;

    // Ensure connection is ready before joining chat
    if (!this.chatService.isConnectionReady()) {
      const token = localStorage.getItem('token');
      if (token) {
        this.chatService.startConnection(token);
        // Wait a bit for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Join the chat
    await this.chatService.joinChatWithUser(this.otherUserId);

    // Subscribe to message events
    this.subscriptions.push(
      this.chatService.messageReceived$.subscribe(({ senderId, message }) => {
        console.log(`📨 ChatComponent received message - Sender: ${senderId}, OtherUser: ${this.otherUserId}, Message: ${message}`);
        
        // Only add messages from other users, not from 'me'
        if (senderId === this.otherUserId) {
          console.log(`✅ Adding message from other user: ${message}`);
          this.messages.push({ senderId, text: message });
        } else {
          console.log(`❌ Ignoring message from sender: ${senderId} (not the other user)`);
        }
      })
    );

    // Subscribe to chat joined events
    this.subscriptions.push(
      this.chatService.chatJoined$.subscribe(({ otherUserId, roomId }) => {
        console.log(`✅ Chat joined with ${otherUserId} in room ${roomId}`);
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async sendMessage(): Promise<void> {
    if (this.messageText.trim()) {
      const messageText = this.messageText;
      this.messageText = ''; // Clear input immediately
      
      console.log(`💬 Sending message: "${messageText}" to user: ${this.otherUserId}`);
      
      // Add message to local display immediately
      this.messages.push({ senderId: 'me', text: messageText });
      console.log(`✅ Added local message as 'me'`);
      
      // Send message to server
      await this.chatService.sendMessage(messageText, this.otherUserId);
      console.log(`📤 Message sent to server`);
    }
  }
}
