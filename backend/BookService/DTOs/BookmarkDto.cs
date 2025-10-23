using System;

namespace BookService.Dtos
{
    public record BookmarkDto(int Id, int UserId, int BookId, DateTime CreatedAt);

    public record CreateBookmarkDto(int BookId);
}
