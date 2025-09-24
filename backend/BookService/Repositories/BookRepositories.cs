using BookService.Data;
using BookService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookService.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly BookDbContext _db;

        public BookRepository(BookDbContext db)
        {
            _db = db;
        }

        // Create new book
        public async Task<Book> CreateBookAsync(Book book)
        {
            _db.Books.Add(book);
            await _db.SaveChangesAsync();
            return book;
        }

        // Get book by ID
        public async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _db.Books
                .Include(b => b.Chunks)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        // Get all approved books (visible to readers)
        public async Task<IEnumerable<Book>> GetAllApprovedBooksAsync()
        {
            return await _db.Books
                .Where(b => b.IsApproved)
                .Include(b => b.Chunks)
                .ToListAsync();
        }

        // Update book details (title, description)
        public async Task UpdateBookAsync(Book book)
        {
            _db.Books.Update(book);
            await _db.SaveChangesAsync();
        }

        // Delete book and associated chunks
        public async Task DeleteBookAsync(int id)
        {
            var book = await _db.Books.Include(b => b.Chunks).FirstOrDefaultAsync(b => b.Id == id);
            if (book != null)
            {
                _db.BookChunks.RemoveRange(book.Chunks);
                _db.Books.Remove(book);
                await _db.SaveChangesAsync();
            }
        }

        // Approve book (admin only)
        public async Task ApproveBookAsync(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book != null)
            {
                book.IsApproved = true;
                book.UpdatedAt = System.DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        // Get all books by author
        public async Task<IEnumerable<Book>> GetBooksByAuthorAsync(int authorId)
        {
            return await _db.Books
                .Where(b => b.AuthorId == authorId)
                .Include(b => b.Chunks)
                .ToListAsync();
        }
    }
}
