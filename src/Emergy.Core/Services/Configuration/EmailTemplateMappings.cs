using System.Collections.Generic;

namespace Emergy.Core.Services.Configuration
{
    public static class EmailTemplateMappings
    {
        public static void AddEmailTemplate(string key, string value)
        {
            if (!Mappings.ContainsKey(key))
            {
                Mappings[key] = value;
            }
        }
        public static string GetEmailTemplate(string key)
        {
            return Mappings[key];
        }
        private static Dictionary<string, string> Mappings { get; } = new Dictionary<string, string>();
    }
}
