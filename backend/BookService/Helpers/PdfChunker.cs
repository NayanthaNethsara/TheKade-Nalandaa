using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using BookService.Helpers;

namespace BookService.Helpers
{
    public class PdfChunker : IPdfChunker
    {
        // Split PDF into chunks of N pages each
        public async Task<List<MemoryStream>> SplitPdfAsync(Stream pdfStream, int pagesPerChunk)
        {
            return await Task.Run(() =>
            {
                var chunks = new List<MemoryStream>();
                var document = PdfReader.Open(pdfStream, PdfDocumentOpenMode.Import);

                int totalPages = document.PageCount;
                int chunkCount = (int)Math.Ceiling((double)totalPages / pagesPerChunk);

                for (int i = 0; i < chunkCount; i++)
                {
                    var chunk = new PdfDocument();
                    for (int j = 0; j < pagesPerChunk; j++)
                    {
                        int pageIndex = i * pagesPerChunk + j;
                        if (pageIndex >= totalPages) break;

                        chunk.AddPage(document.Pages[pageIndex]);
                    }

                    var ms = new MemoryStream();
                    chunk.Save(ms, false);
                    ms.Position = 0;
                    chunks.Add(ms);
                }

                return chunks;
            });
        }
    }
}
