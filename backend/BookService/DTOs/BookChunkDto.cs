using System;

namespace BookService.DTOs
{
    public record BookChunkDto(
        int Id,
        int ChunkNumber,
        int StartPage,
        int EndPage,
        string? Url,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
