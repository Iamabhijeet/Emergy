
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Emergy.Core.Models.ReCaptcha
{
    public class ReCaptchaApiResponse
    {
        public ReCaptchaApiResponse()
        {
            Errors = new List<string>();
        }
        [JsonProperty("success")]
        public bool IsValid { get; set; }

        [JsonProperty("error-codes")]
        public IReadOnlyCollection<string> Errors { get; set; }
    }
}
