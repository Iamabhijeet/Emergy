namespace Emergy.Core.Services
{
    interface IUserKeyService
    {
        int GenerateRandomKey();
        string HashKey(string key);
        bool VerifyKeys(string key, string userKey);
    }
}
