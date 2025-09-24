using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace BookService.Helpers
{
    public interface IPdfChunker
    {
        Task<List<MemoryStream>> SplitPdfAsync(Stream pdfStream, int pagesPerChunk);
    }
}
