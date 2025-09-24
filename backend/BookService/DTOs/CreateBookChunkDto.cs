using Microsoft.AspNetCore.Http;

namespace BookService.Dtos
{
    public record BookCreateDto(
        string Title,
        string? Description,
        int AuthorId,
        string AuthorName,
        IFormFile PdfFile
    );
}
