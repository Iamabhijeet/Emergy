using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Emergy.Data.Models.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum NotificationType
    {
        ReportCreated,
        ReportUpdated,
        AssignedForReport,
        MessageArrived
    }
}