using BookService.Data;
using BookService.Models;
using Microsoft.EntityFrameworkCore;

namespace BookService.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly BookDbContext _db;
        public BookRepository(BookDbContext db) => _db = db;

        public async Task<Book> AddAsync(Book book)
        {
            _db.Books.Add(book);
            await _db.SaveChangesAsync();
            return book;
        }

        public async Task DeleteAsync(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book != null)
            {
                _db.Books.Remove(book);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Book>> GetAllAsync()
        {
            return await _db.Books.Include(b => b.Chunks).ToListAsync();
        }

        public async Task<Book?> GetByIdAsync(int id)
        {
            return await _db.Books.Include(b => b.Chunks)
                                  .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task UpdateAsync(Book book)
        {
            _db.Books.Update(book);
            await _db.SaveChangesAsync();
        }
    }
}
