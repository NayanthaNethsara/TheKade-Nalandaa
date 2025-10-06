using BookService.Data;
using BookService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book == null) return false;

            _db.Books.Remove(book);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Book>> GetAllAsync()
        {
            return await _db.Books.Include(b => b.Chunks).ToListAsync();
        }

        public async Task<List<Book>> GetApprovedAsync()
        {
            return await _db.Books.Where(b => b.IsApproved)
                                   .Include(b => b.Chunks)
                                   .ToListAsync();
        }

        public async Task<List<Book>> GetPendingApprovalAsync()
        {
            return await _db.Books.Where(b => !b.IsApproved)
                                   .Include(b => b.Chunks)
                                   .ToListAsync();
        }

        public async Task<Book?> GetByIdAsync(int id)
        {
            return await _db.Books.Include(b => b.Chunks)
                                  .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Book> UpdateAsync(Book book)
        {
            _db.Books.Update(book);
            await _db.SaveChangesAsync();
            return book;
        }

        public async Task<bool> ApproveAsync(int id)
        {
            var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (book == null) return false;
            if (book.IsApproved) return true; // already approved
            book.IsApproved = true;
            _db.Books.Update(book);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
