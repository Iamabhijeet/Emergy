using System;
using System.Diagnostics;
using Emergy.Core.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Emergy.Api.Tests.Controllers
{
    [TestClass]
    public class HashTests
    {
        [TestMethod]
        public void VerifySomeHashes()
        {
            UserKeyService service = new UserKeyService();
            string key1 = service.GenerateRandomKey();
            string key2 = service.GenerateRandomKey();    
            Debug.Write($"key1 : {key1}");
            Debug.Write($"key2 : {key1}");

            byte[] hash1 = service.HashKey(key1);
            byte[] hash2 = service.HashKey(key2);

            bool equals1 = service.VerifyKeys(hash1, key1);
            bool equals2 = service.VerifyKeys(hash1, key2);
            bool equals3 = service.VerifyKeys(hash2, key1);
            bool equals4 = service.VerifyKeys(hash2, key2);
            Debug.Write($"equals1 : {equals1}");
            Debug.Write($"equals2 : {equals2}");
            Debug.Write($"equals3 : {equals3}");
            Debug.Write($"equals4 : {equals4}");
        }
    }
}
