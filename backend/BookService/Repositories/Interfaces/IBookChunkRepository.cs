using BookService.Models;

namespace BookService.Repositories
{
    public interface IBookChunkRepository
    {
        Task<BookChunk?> GetByIdAsync(int id);
        Task<IEnumerable<BookChunk>> GetByBookIdAsync(int bookId);
        Task<BookChunk> AddAsync(BookChunk chunk);
        Task UpdateAsync(BookChunk chunk);
        Task DeleteAsync(int id);
    }
}
