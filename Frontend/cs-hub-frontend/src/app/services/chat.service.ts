import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public hubConnection!: signalR.HubConnection;
  private isConnecting = false;
  private eventListenersSetup = false;

  // Observable subjects for components to subscribe to
  public newChatStarted$ = new Subject<string>();
  public messageReceived$ = new Subject<{ senderId: string; message: string }>();
  public chatJoined$ = new Subject<{ otherUserId: string; roomId: string }>();

  constructor() {}

  // 1️⃣ Start connection
  public startConnection(token: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('✅ SignalR connection already established');
      return;
    }

    console.log('🔄 Starting SignalR connection...');
    console.log('🔗 Hub URL: http://localhost:5000/chatHub');
    console.log('🔑 Token available:', !!token);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5000/chatHub?access_token=${token}`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR connection started successfully');
        console.log('🔗 Connection state:', this.hubConnection.state);
        this.isConnecting = false;
        this.setupEventListeners();
      })
      .catch((err) => {
        console.error('❌ SignalR connection failed:', err);
        console.error('🔍 Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        this.isConnecting = false;
      });
  }

  private setupEventListeners(): void {
    if (this.eventListenersSetup) {
      console.log('⚠️ Event listeners already setup, skipping...');
      return;
    }

    console.log('🔧 Setting up event listeners...');

    // Listen for new chat notifications
    this.hubConnection.on('NewChatStarted', (otherUserId: string) => {
      console.log(`📢 New chat started with ${otherUserId}`);
      this.newChatStarted$.next(otherUserId);
    });

    // Listen for messages
    this.hubConnection.on('ReceiveMessage', (senderId: string, message: string) => {
      console.log(`📨 Message from ${senderId}: ${message}`);
      this.messageReceived$.next({ senderId, message });
    });

    // Listen for chat joined confirmation
    this.hubConnection.on('ChatJoined', (otherUserId: string, roomId: string) => {
      console.log(`✅ Chat joined with ${otherUserId} in room ${roomId}`);
      this.chatJoined$.next({ otherUserId, roomId });
    });

    // Listen for active chats received
    this.hubConnection.on('ActiveChatsReceived', (chats: any[]) => {
      console.log('📋 Active chats received:', chats);
    });

    this.eventListenersSetup = true;
    console.log('✅ Event listeners setup complete');
  }

  // 2️⃣ Join a chat with specific user
  public async joinChatWithUser(otherUserId: string): Promise<void> {
    if (!this.hubConnection) {
      console.error('❌ Hub connection not initialized');
      return;
    }

    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.log('⏳ Waiting for connection to be established...');
      try {
        await this.hubConnection.start();
        console.log('✅ Connection established, joining chat...');
        this.setupEventListeners();
      } catch (err) {
        console.error('❌ Failed to establish connection:', err);
        return;
      }
    }

    try {
      await this.hubConnection.invoke('JoinChatWithUser', otherUserId);
      console.log(`✅ Joined chat with user: ${otherUserId}`);
    } catch (err) {
      console.error('❌ Failed to join chat:', err);
    }
  }

  // 3️⃣ Send message to user
  public async sendMessage(message: string, receiverUserId: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ Hub connection not available or not connected');
      return;
    }

    try {
      await this.hubConnection.invoke('SendMessage', message, receiverUserId);
      console.log(`✅ Message sent to ${receiverUserId}`);
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  }

  // 4️⃣ Get active chats
  public async getActiveChats(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ Hub connection not available or not connected');
      return;
    }

    try {
      await this.hubConnection.invoke('GetActiveChats');
      console.log('✅ Requested active chats');
    } catch (err) {
      console.error('❌ Failed to get active chats:', err);
    }
  }

  // 5️⃣ Stop connection
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.eventListenersSetup = false;
      console.log('🛑 SignalR connection stopped and event listeners reset');
    }
  }

  // 6️⃣ Check if connection is ready
  public isConnectionReady(): boolean {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }
}
