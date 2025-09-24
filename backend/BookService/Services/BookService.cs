using BookService.Dtos;
using BookService.Models;
using BookService.Repositories;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BookService.Services
{
    public class BookServiceImpl : IBookService
    {
        private readonly IBookRepository _bookRepo;

        public BookServiceImpl(IBookRepository bookRepo)
        {
            _bookRepo = bookRepo;
        }

        public async Task<BookDto> CreateBookAsync(BookCreateDto dto)
        {
            var book = new Book
            {
                Title = dto.Title,
                Description = dto.Description,
                AuthorId = dto.AuthorId,
                AuthorName = dto.AuthorName,
                Chunks = dto.ChunkUrls.Select((url, index) => new BookChunk
                {
                    ChunkNumber = index + 1,
                    StoragePath = url
                }).ToList()
            };

            var created = await _bookRepo.AddAsync(book);

            return new BookDto(
                created.Id,
                created.Title,
                created.Description,
                created.AuthorId,
                created.AuthorName,
                created.Chunks.Select(c => new BookChunkDto(c.Id, c.ChunkNumber, c.StoragePath)).ToList()
            );
        }

        public async Task<BookDto?> GetBookByIdAsync(int id)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) return null;

            return new BookDto(
                book.Id,
                book.Title,
                book.Description,
                book.AuthorId,
                book.AuthorName,
                book.Chunks.Select(c => new BookChunkDto(c.Id, c.ChunkNumber, c.StoragePath)).ToList()
            );
        }

        public async Task<List<BookDto>> GetAllBooksAsync()
        {
            var books = await _bookRepo.GetAllAsync();
            return books.Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Description,
                b.AuthorId,
                b.AuthorName,
                b.Chunks.Select(c => new BookChunkDto(c.Id, c.ChunkNumber, c.StoragePath)).ToList()
            )).ToList();
        }

        public async Task<BookDto?> UpdateBookAsync(int id, BookCreateDto dto)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) return null;

            book.Title = dto.Title;
            book.Description = dto.Description;
            // Optionally update chunks if needed
            await _bookRepo.UpdateAsync(book);

            return await GetBookByIdAsync(id);
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) return false;

            await _bookRepo.DeleteAsync(id);
            return true;
        }

        // New method to fetch a single chunk
        public async Task<BookChunkDto?> GetChunkAsync(int bookId, int chunkNumber)
        {
            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null) return null;

            var chunk = book.Chunks.FirstOrDefault(c => c.ChunkNumber == chunkNumber);
            if (chunk == null) return null;

            return new BookChunkDto(chunk.Id, chunk.ChunkNumber, chunk.StoragePath);
        }
    }
}
