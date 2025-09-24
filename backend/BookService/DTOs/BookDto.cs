using System.Collections.Generic;

namespace BookService.Dtos
{
    public record BookDto(
        int Id,
        string Title,
        string? Description,
        int AuthorId,
        string AuthorName,
        string TitleSlug,
        string CoverImagePath
    );
}
