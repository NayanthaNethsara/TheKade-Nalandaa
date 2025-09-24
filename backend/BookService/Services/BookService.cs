using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookService.Dtos;
using BookService.Helpers;
using BookService.Models;
using BookService.Repositories;

namespace BookService.Services
{
    public class BookServiceImpl : IBookService
    {
        private readonly IBookRepository _bookRepo;
        private readonly IStorageHelper _storageHelper;
        private readonly IPdfChunker _pdfChunker;

        public BookServiceImpl(IBookRepository bookRepo, IStorageHelper storageHelper, IPdfChunker pdfChunker)
        {
            _bookRepo = bookRepo;
            _storageHelper = storageHelper;
            _pdfChunker = pdfChunker;
        }

        public async Task<BookDto> CreateBookAsync(BookCreateDto dto)
        {
            // 1. Upload original PDF
            var pdfUpload = await _storageHelper.UploadFileAsync(dto.PdfFile, "books/original");
            if (!pdfUpload.Success) throw new Exception(pdfUpload.Error);

            // 2. Chunk PDF
            var chunks = await _pdfChunker.SplitPdfAsync(dto.PdfFile.OpenReadStream(), 10);
            var chunkDtos = new List<BookChunk>();

            for (int i = 0; i < chunks.Count; i++)
            {
                var uploadResult = await _storageHelper.UploadFileAsync(chunks[i], "books/chunks", $"chunk_{i + 1}.pdf");
                if (uploadResult.Success)
                {
                    chunkDtos.Add(new BookChunk
                    {
                        ChunkNumber = i + 1,
                        StoragePath = uploadResult.Url!
                    });
                }
            }

            // 3. Save Book
            var book = new Book
            {
                Title = dto.Title,
                Description = dto.Description,
                AuthorId = dto.AuthorId,
                AuthorName = dto.AuthorName,
                Chunks = chunkDtos
            };

            var created = await _bookRepo.AddAsync(book);

            // 4. Return DTO
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
            // Implement update logic if needed
            return null;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            return await _bookRepo.DeleteAsync(id); // Make sure DeleteAsync returns Task<bool>
        }
    }
}
