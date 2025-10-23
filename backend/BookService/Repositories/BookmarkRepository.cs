using BookService.Data;
using BookService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookService.Repositories
{
    public interface IBookmarkRepository
    {
        Task<Bookmark> AddAsync(Bookmark bookmark);
        Task<bool> ExistsAsync(int userId, int bookId);
        Task<bool> DeleteAsync(int userId, int bookId);
        Task<List<Bookmark>> GetByUserAsync(int userId);
    }

    public class BookmarkRepository : IBookmarkRepository
    {
        private readonly BookDbContext _db;
        public BookmarkRepository(BookDbContext db) => _db = db;

        public async Task<Bookmark> AddAsync(Bookmark bookmark)
        {
            _db.Bookmarks.Add(bookmark);
            await _db.SaveChangesAsync();
            return bookmark;
        }

        public async Task<bool> ExistsAsync(int userId, int bookId)
        {
            return await _db.Bookmarks.AnyAsync(b => b.UserId == userId && b.BookId == bookId);
        }

        public async Task<bool> DeleteAsync(int userId, int bookId)
        {
            var entity = await _db.Bookmarks.FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);
            if (entity == null) return false;
            _db.Bookmarks.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Bookmark>> GetByUserAsync(int userId)
        {
            return await _db.Bookmarks.Where(b => b.UserId == userId)
                                     .Include(b => b.Book)
                                     .ToListAsync();
        }
    }
}
