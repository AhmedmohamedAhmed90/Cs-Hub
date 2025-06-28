using Microsoft.AspNetCore.SignalR;

namespace Cs_Hub.Hubs
{

    public sealed class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Connected: {Context.UserIdentifier}");
        await base.OnConnectedAsync();
    }

    // Called when user opens the chat page with another user
    public async Task JoinChatWithUser(string otherUserId)
    {
        var currentUserId = Context.UserIdentifier!;
        var roomId = GetChatRoomId(currentUserId, otherUserId);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        Console.WriteLine($"{currentUserId} joined chat room: {roomId}");

        // Notify the other user if connected
        await Clients.User(otherUserId).SendAsync("NewChatStarted", currentUserId);
    }

    // Send message to the room
    public async Task SendMessage(string message, string receiverUserId)
    {
        var senderUserId = Context.UserIdentifier!;
        var roomId = GetChatRoomId(senderUserId, receiverUserId);

        await Clients.Group(roomId).SendAsync("ReceiveMessage", senderUserId, message);
    }

    private static string GetChatRoomId(string userA, string userB)
    {
        var ids = new List<string> { userA, userB };
        ids.Sort(); // ensures same room name for both directions
        return $"room-{ids[0]}-{ids[1]}";
    }
}


}