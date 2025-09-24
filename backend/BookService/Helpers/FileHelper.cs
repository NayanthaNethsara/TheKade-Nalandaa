using System.IO;

namespace BookService.Helpers
{
    public static class FileHelper
    {
        public static byte[] ReadFileChunk(string path, int start, int length)
        {
            using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            byte[] buffer = new byte[length];
            fs.Seek(start, SeekOrigin.Begin);
            fs.Read(buffer, 0, length);
            return buffer;
        }
    }
}
