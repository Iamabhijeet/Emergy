using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Emergy.Data.Models.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum LocationType
    {
        Captured,
        Fixed
    }
}