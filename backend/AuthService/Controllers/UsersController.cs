using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users/readers
        [HttpGet("readers")]
        public async Task<ActionResult<IEnumerable<ReaderSummeryDto>>> GetAllReaders()
        {
            var readers = await _userService.GetAllReadersAsync();
            return Ok(readers);
        }

        // GET: api/users/readers/{id}
        [HttpGet("readers/{id:guid}")]
        public async Task<ActionResult<ReaderSummeryDto>> GetReaderById(int id)
        {
            var reader = await _userService.GetReaderByIdAsync(id);
            if (reader is null)
                return NotFound();

            return Ok(reader);
        }

    }
}
