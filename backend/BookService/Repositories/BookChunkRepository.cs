using BookService.Data;
using BookService.Models;
using Microsoft.EntityFrameworkCore;

namespace BookService.Repositories
{
    public class BookChunkRepository : IBookChunkRepository
    {
        private readonly BookDbContext _db;
        public BookChunkRepository(BookDbContext db) => _db = db;

        public async Task<BookChunk> AddAsync(BookChunk chunk)
        {
            _db.BookChunks.Add(chunk);
            await _db.SaveChangesAsync();
            return chunk;
        }

        public async Task DeleteAsync(int id)
        {
            var chunk = await _db.BookChunks.FindAsync(id);
            if (chunk != null)
            {
                _db.BookChunks.Remove(chunk);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BookChunk>> GetByBookIdAsync(int bookId)
        {
            return await _db.BookChunks
                            .Where(c => c.BookId == bookId)
                            .OrderBy(c => c.ChunkNumber)
                            .ToListAsync();
        }

        public async Task<BookChunk?> GetByIdAsync(int id)
        {
            return await _db.BookChunks.FindAsync(id);
        }

        public async Task UpdateAsync(BookChunk chunk)
        {
            _db.BookChunks.Update(chunk);
            await _db.SaveChangesAsync();
        }
    }
}
