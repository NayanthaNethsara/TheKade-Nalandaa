using BookService.Dtos;
using BookService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookmarkController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookmarkController(IBookService bookService)
        {
            _bookService = bookService;
        }

        private int? GetUserIdFromClaims()
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(idStr, out var id)) return id;
            return null;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateBookmarkDto dto)
        {
            var uid = GetUserIdFromClaims();
            if (uid == null) return Unauthorized();

            var created = await _bookService.AddBookmarkAsync(uid.Value, dto);
            if (created == null) return Conflict(new { message = "Bookmark already exists" });
            return CreatedAtAction(nameof(GetAll), new { }, created);
        }

        [Authorize]
        [HttpDelete("{bookId}")]
        public async Task<IActionResult> Remove(int bookId)
        {
            var uid = GetUserIdFromClaims();
            if (uid == null) return Unauthorized();

            var ok = await _bookService.RemoveBookmarkAsync(uid.Value, bookId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var uid = GetUserIdFromClaims();
            if (uid == null) return Unauthorized();

            var list = await _bookService.GetUserBookmarksAsync(uid.Value);
            return Ok(list);
        }
    }
}
