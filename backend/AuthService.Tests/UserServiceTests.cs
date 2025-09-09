using AuthService.Data;
using AuthService.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace AuthService.Tests
{
    public class UserServiceTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly AuthDbContext _context;

        public UserServiceTests()
        {
            // Create in-memory SQLite connection
            _connection = new SqliteConnection("Filename=:memory:");
            _connection.Open();

            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseSqlite(_connection)
                .Options;

            _context = new AuthDbContext(options);
            _context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _context.Dispose();
            _connection.Close();
        }

        [Fact]
        public async Task Can_Add_User()
        {
            var user = new User
            {
                GoogleId = "google123",
                Email = "test@example.com",
                Name = "Test User",
                Role = Roles.Reader,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var savedUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            Assert.NotNull(savedUser);
            Assert.Equal(Roles.Reader, savedUser!.Role);
        }

        [Fact]
        public async Task Cannot_Add_Duplicate_Email()
        {
            var user1 = new User
            {
                GoogleId = "google1",
                Email = "duplicate@example.com",
                Name = "User One",
                Role = Roles.Reader,
                CreatedAt = DateTime.UtcNow
            };

            var user2 = new User
            {
                GoogleId = "google2",
                Email = "duplicate@example.com", // same email
                Name = "User Two",
                Role = Roles.Reader,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user1);
            await _context.SaveChangesAsync();

            _context.Users.Add(user2);
            await Assert.ThrowsAsync<DbUpdateException>(async () => await _context.SaveChangesAsync());
        }
    }
}
