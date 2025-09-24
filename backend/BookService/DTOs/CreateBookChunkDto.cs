namespace BookService.DTOs
{
    public record CreateBookChunkDto(
        int ChunkNumber,
        int StartPage,
        int EndPage,
        string StoragePath
    );
}
