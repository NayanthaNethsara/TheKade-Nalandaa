using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("test")]
public class TestController : ControllerBase
{
    // This endpoint requires JWT
    [HttpGet("hello")]
    [Authorize]
    public IActionResult Hello()
    {
        // You can also access the user claims if needed
        var userId = User.FindFirst("id")?.Value;
        var userEmail = User.FindFirst("email")?.Value;

        return Ok(new
        {
            message = "Hello World!",
            userId,
            userEmail
        });
    }

    // Optional: public endpoint to test without JWT
    [HttpGet("public")]
    public IActionResult PublicHello()
    {
        return Ok(new { message = "Hello World - Public!" });
    }
}
