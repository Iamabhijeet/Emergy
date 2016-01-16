using System;
using System.Globalization;

namespace Emergy.Core.Common
{
    public static class DateTimeExtensions
    {
        public static string ToMonthName(this DateTime dateTime)
        {
            return CultureInfo.GetCultureInfo("en-US").DateTimeFormat.GetMonthName(dateTime.Month);
        }
        public static string ToShortMonthName(this DateTime dateTime)
        {
            return CultureInfo.GetCultureInfo("en-US").DateTimeFormat.GetAbbreviatedMonthName(dateTime.Month);
        }
    }
}
