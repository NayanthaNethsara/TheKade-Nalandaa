using BookService.Dtos;
using BookService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        [Authorize] // Require auth; could relax later if public viewing desired
        public async Task<IActionResult> GetApproved()
        {
            var books = await _bookService.GetApprovedBooksAsync();
            return Ok(books);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")] // Only admins see pending list
        public async Task<IActionResult> GetPending()
        {
            var books = await _bookService.GetPendingBooksAsync();
            return Ok(books);
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null) return NotFound();
            if (!book.IsApproved && !IsAdmin()) return Forbid();
            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        [Authorize] // Any authenticated user can submit a book (starts unapproved)
        public async Task<IActionResult> Create([FromBody] BookCreateDto dto)
        {
            // Ensure the author id/name align with token claims if present
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var nameClaim = User.FindFirst(ClaimTypes.Name)?.Value;
                if (int.TryParse(userIdClaim, out var uid))
                {
                    dto = dto with { AuthorId = uid, AuthorName = nameClaim ?? dto.AuthorName };
                }
            }
            var created = await _bookService.CreateBookAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpGet("{bookId}/chunks/{chunkNumber}")]
        [Authorize]
        public async Task<IActionResult> GetChunk(int bookId, int chunkNumber)
        {
            var chunk = await _bookService.GetChunkAsync(bookId, chunkNumber);
            if (chunk == null) return NotFound();
            // ensure parent book is approved (reuse GetById for dto) - simple call
            var book = await _bookService.GetBookByIdAsync(bookId);
            if (book == null) return NotFound();
            if (!book.IsApproved && !IsAdmin()) return Forbid();
            return Ok(chunk);
        }


        // PUT: api/books/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] BookCreateDto dto)
        {
            var updated = await _bookService.UpdateBookAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admin delete
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _bookService.DeleteBookAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")] // Admin approves
        public async Task<IActionResult> Approve(int id)
        {
            var ok = await _bookService.ApproveBookAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        private bool IsAdmin() => User.IsInRole("Admin");
    }
}
