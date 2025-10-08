using AuthService.Helpers;
using Xunit;

namespace AuthService.Tests.Helper
{
    public class PasswordHelperTests
    {
        [Fact]
        public void HashPassword_GeneratesDifferentHashesForSamePassword()
        {
            // Arrange
            var password = "TestPassword123!";

            // Act
            var hash1 = PasswordHelper.HashPassword(password);
            var hash2 = PasswordHelper.HashPassword(password);

            // Assert
            Assert.NotEqual(hash1, hash2); // Should generate different salts
            Assert.True(hash1.Contains(":")); // Should contain salt:hash separator
            Assert.True(hash2.Contains(":"));
        }

        [Fact]
        public void VerifyPassword_CorrectPassword_ReturnsTrue()
        {
            // Arrange
            var password = "TestPassword123!";
            var hash = PasswordHelper.HashPassword(password);

            // Act
            var result = PasswordHelper.VerifyPassword(password, hash);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void VerifyPassword_WrongPassword_ReturnsFalse()
        {
            // Arrange
            var password = "TestPassword123!";
            var wrongPassword = "WrongPassword123!";
            var hash = PasswordHelper.HashPassword(password);

            // Act
            var result = PasswordHelper.VerifyPassword(wrongPassword, hash);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void VerifyPassword_InvalidHashFormat_ReturnsFalse()
        {
            // Arrange
            var password = "TestPassword123!";
            var invalidHash = "invalid_hash_format";

            // Act
            var result = PasswordHelper.VerifyPassword(password, invalidHash);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData(null)]
        public void HashPassword_EmptyOrNullPassword_ThrowsArgumentException(string password)
        {
            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => PasswordHelper.HashPassword(password));
        }

        [Fact]
        public void HashPassword_GeneratesValidBase64Strings()
        {
            // Arrange
            var password = "TestPassword123!";

            // Act
            var hash = PasswordHelper.HashPassword(password);
            var parts = hash.Split(':');

            // Assert
            Assert.Equal(2, parts.Length);
            Assert.True(IsBase64String(parts[0])); // Validate salt is base64
            Assert.True(IsBase64String(parts[1])); // Validate hash is base64
        }

        private bool IsBase64String(string base64)
        {
            try
            {
                var buffer = Convert.FromBase64String(base64);
                return true;
            }
            catch
            {
                return false;
            }
        }

        [Theory]
        [InlineData("Short")]
        [InlineData("VeryLongPasswordThatIsStillValid123!")]
        [InlineData("Special@#$%^&*()Characters")]
        [InlineData("12345678901234567890")]
        [InlineData("Password With Spaces")]
        [InlineData("パスワード")] // Unicode characters
        public void HashPassword_VariousPasswords_GeneratesValidHashes(string password)
        {
            // Act
            var hash = PasswordHelper.HashPassword(password);
            var isValid = PasswordHelper.VerifyPassword(password, hash);

            // Assert
            Assert.True(isValid);
        }
    }
}