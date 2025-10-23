using BookService.Dtos;
using BookService.Models;
using BookService.Repositories;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.HttpResults;

namespace BookService.Services
{
    public class BookServiceImpl : IBookService
    {
        private readonly IBookRepository _bookRepo;
        private readonly IBookmarkRepository _bookmarkRepo;

        public BookServiceImpl(IBookRepository bookRepo, IBookmarkRepository bookmarkRepo)
        {
            _bookRepo = bookRepo;
            _bookmarkRepo = bookmarkRepo;
        }

        public async Task<BookDto> CreateBookAsync(BookCreateDto dto)
        {
            var book = new Book
            {
                Title = dto.Title,
                Description = dto.Description,
                AuthorId = dto.AuthorId,
                AuthorName = dto.AuthorName,
                TitleSlug = dto.TitleSlug,
                CoverImagePath = dto.CoverImagePath,
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
                created.TitleSlug,
                created.CoverImagePath,
                created.IsApproved
            );
        }

        public async Task<BookWithChunkDto?> GetBookByIdAsync(int id)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) return null;

            var firstChunkPath = book.Chunks.FirstOrDefault()?.StoragePath ?? string.Empty;

            return new BookWithChunkDto(
                book.Id,
                book.Title,
                book.Description,
                book.AuthorId,
                book.AuthorName,
                book.TitleSlug,
                book.CoverImagePath,
                firstChunkPath,
                book.IsApproved
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
                b.TitleSlug,
                b.CoverImagePath,
                b.IsApproved
            )).ToList();
        }

        public async Task<List<BookDto>> GetApprovedBooksAsync()
        {
            var books = await _bookRepo.GetApprovedAsync();
            return books.Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Description,
                b.AuthorId,
                b.AuthorName,
                b.TitleSlug,
                b.CoverImagePath,
                b.IsApproved
            )).ToList();
        }

        public async Task<List<BookDto>> GetPendingBooksAsync()
        {
            var books = await _bookRepo.GetPendingApprovalAsync();
            return books.Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Description,
                b.AuthorId,
                b.AuthorName,
                b.TitleSlug,
                b.CoverImagePath,
                b.IsApproved
            )).ToList();
        }

        public async Task<BookDto?> UpdateBookAsync(int id, BookCreateDto dto)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) return null;

            book.Title = dto.Title;
            book.Description = dto.Description;
            book.TitleSlug = dto.TitleSlug;
            book.CoverImagePath = dto.CoverImagePath;
            // Optionally update chunks if needed
            await _bookRepo.UpdateAsync(book);

            return new BookDto(
                book.Id,
                book.Title,
                book.Description,
                book.AuthorId,
                book.AuthorName,
                book.TitleSlug,
                book.CoverImagePath,
                book.IsApproved
            );
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

        public async Task<bool> ApproveBookAsync(int id)
        {
            return await _bookRepo.ApproveAsync(id);
        }

        // Bookmark methods
        public async Task<BookmarkDto?> AddBookmarkAsync(int userId, CreateBookmarkDto dto)
        {
            // prevent duplicates
            if (await _bookmarkRepo.ExistsAsync(userId, dto.BookId)) return null;

            var bm = new Models.Bookmark
            {
                UserId = userId,
                BookId = dto.BookId
            };

            var created = await _bookmarkRepo.AddAsync(bm);

            return new BookmarkDto(created.Id, created.UserId, created.BookId, created.CreatedAt);
        }

        public async Task<bool> RemoveBookmarkAsync(int userId, int bookId)
        {
            return await _bookmarkRepo.DeleteAsync(userId, bookId);
        }

        public async Task<List<BookmarkDto>> GetUserBookmarksAsync(int userId)
        {
            var list = await _bookmarkRepo.GetByUserAsync(userId);
            return list.Select(b => new BookmarkDto(b.Id, b.UserId, b.BookId, b.CreatedAt)).ToList();
        }
    }
}
