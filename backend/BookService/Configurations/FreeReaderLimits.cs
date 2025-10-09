namespace BookService.Configurations
{
    public class FreeReaderLimits
    {
        public int DailyChunks { get; set; } = 20;
        public int MonthlyChunks { get; set; } = 200;
        public int PreviewChunkCount { get; set; } = 1;
    }
}