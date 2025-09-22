using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public() => Ok(new { message = "Public endpoint" });

        [HttpGet("secure")]
        [Authorize]
        public IActionResult Secure()
        {
            var userId = User.Identity?.Name ?? "unknown";
            return Ok(new { message = "JWT valid", user = userId });
        }
    }
}
