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
        public int GenerateRandomKey()
        {
            return _random.Next(100000, 999999);
        }

        public string HashKey(string key)
        {
            return HashPassword(key);
        }

        public bool VerifyKeys(string key, string userKey)
        {
            return VerifyHashedPassword(userKey, key) == PasswordVerificationResult.Success;
        }

        private readonly Random _random;
    }
}
