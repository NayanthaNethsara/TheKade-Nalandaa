using System.Threading.Tasks;
using BookService.Dtos;

namespace BookService.Services
{
    public interface IBookService
    {
        Task<BookDto> CreateBookAsync(BookCreateDto dto);
        Task<BookDto?> GetBookByIdAsync(int id);
        Task<List<BookDto>> GetAllBooksAsync();
        Task<BookDto?> UpdateBookAsync(int id, BookCreateDto dto);
        Task<bool> DeleteBookAsync(int id);
    }
}
