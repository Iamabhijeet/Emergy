using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Core.Models.ReCaptcha;
using Newtonsoft.Json;

namespace Emergy.Core.Services
{
    public class ReCaptchaValidator : IReCaptchaValidator
    {
        public async Task<ReCaptchaApiResponse> Validate(string response)
        {
            var apiResponse = await _client.GetAsync(BuildUrl(response)).WithoutSync();
            var responseContent = await apiResponse.Content.ReadAsStringAsync().WithoutSync();
            return JsonConvert.DeserializeObject<ReCaptchaApiResponse>(responseContent);
        }

        private static string BuildUrl(string response)
        {
            return $"https://www.google.com/recaptcha/api/siteverify?secret={ApiSecret}&response={response}";
        }
        public IReadOnlyCollection<string> GetErrors(ReCaptchaApiResponse apiResponse)
        {
            IList<string> errorsHolder = new List<string>();
            if (!apiResponse.IsValid)
            {
                if (apiResponse.Errors.Count <= 0)
                {
                    return errorsHolder.ToArray();
                }
                string errorType = apiResponse.Errors.ElementAt(0).ToLower();
                switch (errorType)
                {
                    case ("missing-input-secret"):
                        errorsHolder.Add("The secret parameter is missing.");
                        break;
                    case ("invalid-input-secret"):
                        errorsHolder.Add("The secret parameter is invalid or malformed.");
                        break;

                    case ("missing-input-response"):
                        errorsHolder.Add("The response parameter is missing.");
                        break;
                    case ("invalid-input-response"):
                        errorsHolder.Add("The response parameter is invalid or malformed.");
                        break;

                    default:
                        errorsHolder.Add("An Unknown error occured. Please try again");
                        break;
                }
            }
            return errorsHolder.ToArray();
        }

        public ReCaptchaValidator()
        {
            _client = new HttpClient();
        }
        private readonly HttpClient _client;
        private const string ApiSecret = "6LeuIBMTAAAAAKzuwjI2uKoG3UbTFxylwA7DiFzs";
        public void Dispose()
        {
            _client.Dispose();
        }
        ~ReCaptchaValidator()
        {
            Dispose();
        }
    }
}
