using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Supabase.Storage;
using BookService.Dtos;

namespace BookService.Helpers
{
    public class SupabaseStorageHelper : IStorageHelper
    {
        private readonly Supabase.Client _client;
        private readonly string _bucketName = "books";

        public SupabaseStorageHelper(IConfiguration config)
        {
            var supabaseUrl = config["Supabase:Url"]!;
            var supabaseKey = config["Supabase:Key"]!;
            _client = new Supabase.Client(supabaseUrl, supabaseKey);
        }

        public async Task<StorageResultDto> UploadFileAsync(IFormFile file, string path)
        {
            return await UploadFileAsync(file.OpenReadStream(), path, file.FileName);
        }

        public async Task<StorageResultDto> UploadFileAsync(Stream fileStream, string path, string fileName)
        {
            try
            {
                var filePath = $"{path}/{Guid.NewGuid()}_{fileName}";
                await _client.Storage
                    .From(_bucketName)
                    .Upload(fileStream, filePath, new Supabase.Storage.FileOptions
                    {
                        CacheControl = "3600",
                        Upsert = true
                    });

                return new StorageResultDto(true, GetPublicUrl(filePath), null);
            }
            catch (Exception ex)
            {
                return new StorageResultDto(false, null, ex.Message);
            }
        }

        public async Task<bool> DeleteFileAsync(string path)
        {
            try
            {
                await _client.Storage.From(_bucketName).Remove(path);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetPublicUrl(string path)
        {
            return _client.Storage.From(_bucketName).GetPublicUrl(path);
        }
    }
}
