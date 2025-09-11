namespace AuthService.DTOs
{
    public record UserStatusUpdateDto(int UserId, bool IsActive);

    public record UserProfilePictureDto(int UserId, string PictureUrl);
}
