using BookService.Models;

namespace BookService.Repositories
{
    public interface IBookRepository
    {
        Task<Book> AddAsync(Book book);
        Task<Book?> GetByIdAsync(int id);
        Task<List<Book>> GetAllAsync();
        Task<Book> UpdateAsync(Book book);  // must return updated Book
        Task<bool> DeleteAsync(int id);     // must return Task<bool>
    }

}
