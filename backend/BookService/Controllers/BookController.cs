using BookService.Dtos;
using BookService.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET: api/books
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null) return NotFound();
            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookCreateDto dto)
        {
            var created = await _bookService.CreateBookAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpGet("{bookId}/chunks/{chunkNumber}")]
        public async Task<IActionResult> GetChunk(int bookId, int chunkNumber)
        {
            var chunk = await _bookService.GetChunkAsync(bookId, chunkNumber);
            if (chunk == null) return NotFound();
            return Ok(chunk);
        }


        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BookCreateDto dto)
        {
            var updated = await _bookService.UpdateBookAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _bookService.DeleteBookAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
