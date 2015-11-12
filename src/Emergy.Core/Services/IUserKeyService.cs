namespace Emergy.Core.Services
{
    interface IUserKeyService
    {
        string GenerateRandomKey();
        string HashKey(string key);
        bool VerifyKeys(string hashedKey, string providedKey);
    }
}
