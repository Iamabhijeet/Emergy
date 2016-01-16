using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Emergy.Core.Models.Stats
{
    public class StatsViewModel
    {
        public AllTimeStats AllTime                             { get; set; }
        public Percentages ThisMonthPercentages                 { get; set; }
        public Numbers ThisMonthNumbers                         { get; set; }
        public IReadOnlyCollection<Chart.ChartRow> ReportsChart { get; set; }

        public class AllTimeStats
        {
            public Numbers Numbers                                  { get; set; }
            public Percentages Percentages                          { get; set; }
        }

        public class Chart
        {
            public IReadOnlyCollection<string> Categories => new[] { "Month", "Reports", "Completed Reports" };
            public IReadOnlyCollection<ChartRow> Rows { get; set; }

            public class ChartRow
            {
                public string Month              { get; set; }
                public int ReportsCount          { get; set; }
                public int CompletedReportsCount { get; set; }
            }
        }
        public class Numbers
        {
            public int ReportsCount      { get; set; }
            public int ReportsProcessing { get; set; }
            public int ReportsCompleted  { get; set; }
            public int ReportsFailed     { get; set; }

        }
        public class Percentages
        {
            public double AverageReportsCompleted  { get; set; }
            public double AverageReportsFailure    { get; set; }
            public double AverageReportsProcessing { get; set; }
        }
    }
}