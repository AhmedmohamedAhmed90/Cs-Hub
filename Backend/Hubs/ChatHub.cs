using Microsoft.AspNetCore.SignalR;

namespace Cs_Hub.Hubs
{
    public sealed class ChatHub : Hub
    {
        // Track user group memberships to prevent duplicates
        private static readonly Dictionary<string, HashSet<string>> UserGroups = new();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            var connectionId = Context.ConnectionId;
            var user = Context.User;
            
            Console.WriteLine($"✅ User {userId} connected with connection ID: {connectionId}");
            Console.WriteLine($"👤 User claims: {string.Join(", ", user?.Claims.Select(c => $"{c.Type}={c.Value}") ?? Array.Empty<string>())}");
            
            // Add user to their personal group for notifications
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
                Console.WriteLine($"👤 User {userId} added to personal group: user-{userId}");
                
                // Initialize user groups tracking
                if (!UserGroups.ContainsKey(userId))
                {
                    UserGroups[userId] = new HashSet<string>();
                }
                UserGroups[userId].Add($"user-{userId}");
            }
            else
            {
                Console.WriteLine("⚠️ Warning: User ID is null or empty");
            }
            
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"❌ User {userId} disconnected: {exception?.Message ?? "Normal disconnect"}");
            
            // Clean up user groups tracking
            if (!string.IsNullOrEmpty(userId) && UserGroups.ContainsKey(userId))
            {
                UserGroups.Remove(userId);
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        // Called when user opens the chat page with another user
        public async Task JoinChatWithUser(string otherUserId)
        {
            var currentUserId = Context.UserIdentifier!;
            var roomId = GetChatRoomId(currentUserId, otherUserId);
            var connectionId = Context.ConnectionId;

            Console.WriteLine($"🚀 {currentUserId} (conn: {connectionId}) joining chat room: {roomId}");

            // Check if user is already in the group using our tracking
            if (UserGroups.ContainsKey(currentUserId) && UserGroups[currentUserId].Contains(roomId))
            {
                Console.WriteLine($"⚠️ User {currentUserId} is already in group {roomId}, skipping...");
                return;
            }

            // Add current user to the chat room
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            Console.WriteLine($"✅ {currentUserId} added to group: {roomId}");

            // Track the group membership
            if (!UserGroups.ContainsKey(currentUserId))
            {
                UserGroups[currentUserId] = new HashSet<string>();
            }
            UserGroups[currentUserId].Add(roomId);

            // Notify the other user that a chat has started
            await Clients.Group($"user-{otherUserId}").SendAsync("NewChatStarted", currentUserId);
            Console.WriteLine($"📢 Notification sent to user-{otherUserId} about new chat with {currentUserId}");

            // Also notify the current user that they've joined the chat
            await Clients.Caller.SendAsync("ChatJoined", otherUserId, roomId);
            
            // Log updated groups
            Console.WriteLine($"👤 User {currentUserId} is now in groups: {string.Join(", ", UserGroups[currentUserId])}");
        }

        // Send message to the room
        public async Task SendMessage(string message, string receiverUserId)
        {
            var senderUserId = Context.UserIdentifier!;
            var roomId = GetChatRoomId(senderUserId, receiverUserId);
            var connectionId = Context.ConnectionId;

            Console.WriteLine($"💬 {senderUserId} (conn: {connectionId}) sending message to {receiverUserId} in room: {roomId}");

            // Send to all users in the chat room except the sender
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveMessage", senderUserId, message);
            Console.WriteLine($"✅ Message sent to others in group: {roomId}");
            
            // Log the current user's groups for debugging
            if (UserGroups.ContainsKey(senderUserId))
            {
                Console.WriteLine($"👤 User {senderUserId} is in groups: {string.Join(", ", UserGroups[senderUserId])}");
            }
        }

        // Get all active chats for the current user
        public async Task GetActiveChats()
        {
            var currentUserId = Context.UserIdentifier!;
            Console.WriteLine($"📋 Getting active chats for user: {currentUserId}");
            
            // This would typically query a database for active chats
            // For now, we'll just acknowledge the request
            await Clients.Caller.SendAsync("ActiveChatsReceived", new List<object>());
        }

        private static string GetChatRoomId(string userA, string userB)
        {
            var ids = new List<string> { userA, userB };
            ids.Sort(); // ensures same room name for both directions
            return $"room-{ids[0]}-{ids[1]}";
        }
    }
}