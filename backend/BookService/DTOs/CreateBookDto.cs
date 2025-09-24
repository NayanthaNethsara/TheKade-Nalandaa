namespace BookService.DTOs
{
    public record CreateBookDto(
        string Title,
        string? Description,
        int AuthorId,
        string AuthorName
    );
}
