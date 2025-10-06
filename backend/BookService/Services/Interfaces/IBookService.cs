using BookService.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookService.Services
{
    public interface IBookService
    {
        Task<BookDto> CreateBookAsync(BookCreateDto dto);
        Task<BookWithChunkDto?> GetBookByIdAsync(int id);
        Task<List<BookDto>> GetAllBooksAsync();
        Task<BookDto?> UpdateBookAsync(int id, BookCreateDto dto);
        Task<bool> DeleteBookAsync(int id);

        // New method to get single chunk
        Task<BookChunkDto?> GetChunkAsync(int bookId, int chunkNumber);
        Task<List<BookDto>> GetApprovedBooksAsync();
        Task<List<BookDto>> GetPendingBooksAsync();
        Task<bool> ApproveBookAsync(int id);
    }
}
