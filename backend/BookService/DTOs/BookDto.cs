using System;
using System.Collections.Generic;

namespace BookService.DTOs
{
    public record BookDto(
        int Id,
        string Title,
        string? Description,
        int AuthorId,
        string AuthorName,
        bool IsApproved,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<BookChunkDto> Chunks
    );
}
