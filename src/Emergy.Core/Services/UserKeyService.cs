using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.AspNet.Identity;

namespace Emergy.Core.Services
{
    public class UserKeyService : PasswordHasher, IUserKeyService
    {
        public UserKeyService()
        {
            _random = new Random((int)DateTime.Now.Ticks & (0x0000FFFF + 69));
        }
        public string GenerateRandomKey()
        {
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
        private readonly Random _random;
    }
}
