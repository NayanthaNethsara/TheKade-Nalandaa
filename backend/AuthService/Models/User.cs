namespace AuthService.Models;

public class User
{
    public int Id { get; set; }
    public string GoogleId { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
