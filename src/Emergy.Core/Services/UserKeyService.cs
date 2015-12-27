using System;
using Microsoft.AspNet.Identity;

namespace Emergy.Core.Services
{
    public class UserKeyService : PasswordHasher, IUserKeyService
    {
        public UserKeyService()
        {
            _random = new Random();
        }
        public string GenerateRandomKey()
        {
            _random = new Random();
            return _random.Next(111111, 999999).ToString();
        }
        public string HashKey(string key)
        {
            return base.HashPassword(key);
        }
        public bool VerifyKeys(string hashedKey, string providedKey)
        {
            return base.VerifyHashedPassword(hashedKey, providedKey) == PasswordVerificationResult.Success
                || base.VerifyHashedPassword(hashedKey, providedKey) == PasswordVerificationResult.SuccessRehashNeeded;
        }
        private Random _random;
    }
}
