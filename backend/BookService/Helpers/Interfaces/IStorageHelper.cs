using System.IO;
using System.Threading.Tasks;
using BookService.Dtos;
using Microsoft.AspNetCore.Http;

namespace BookService.Helpers
{
    public interface IStorageHelper
    {
        Task<StorageResultDto> UploadFileAsync(IFormFile file, string path);
        Task<StorageResultDto> UploadFileAsync(Stream fileStream, string path, string fileName);
        Task<bool> DeleteFileAsync(string path);
        string GetPublicUrl(string path);
    }
}
