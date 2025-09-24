using BookService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookService.Repositories
{
    public interface IBookRepository
    {
        Task<Book> CreateBookAsync(Book book);
        Task<Book?> GetBookByIdAsync(int id);
        Task<IEnumerable<Book>> GetAllApprovedBooksAsync();
        Task UpdateBookAsync(Book book);
        Task DeleteBookAsync(int id);
        Task ApproveBookAsync(int id);  // Only Admin can approve
        Task<IEnumerable<Book>> GetBooksByAuthorAsync(int authorId);
    }
}
