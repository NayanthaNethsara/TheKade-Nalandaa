using System.Collections.Generic;

namespace BookService.Dtos
{
    public record BookWithChunkDto(
        int Id,
        string Title,
        string? Description,
        int AuthorId,
        string AuthorName,
        string TitleSlug,
        string CoverImagePath,
        string ChunkPath,
        bool IsApproved
    );
}
