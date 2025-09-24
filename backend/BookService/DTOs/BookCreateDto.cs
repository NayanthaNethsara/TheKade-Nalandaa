using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace BookService.Dtos
{
    public record BookCreateDto(
        string Title,
        string Description,
        int AuthorId,
        string AuthorName,
        List<string> ChunkUrls
    );
}
