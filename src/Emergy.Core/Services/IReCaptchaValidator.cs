using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Emergy.Core.Models.ReCaptcha;

namespace Emergy.Core.Services
{
    public interface IReCaptchaValidator : IDisposable
    {
        Task<ReCaptchaApiResponse> Validate(string reponse);
        IReadOnlyCollection<string> GetErrors(ReCaptchaApiResponse apiResponse);
    }
}
