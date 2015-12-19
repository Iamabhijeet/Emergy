using System;
using System.Collections.Generic;
using System.Linq;
using Emergy.Core.Common;
using Emergy.Core.Models.Stats;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;


namespace Emergy.Core.Services
{
    public class StatsService : IStatsService
    {
        public StatsViewModel ComputeStats(IReadOnlyCollection<Report> reportsForQuartal)
        {
            StatsViewModel vm = new StatsViewModel();
            List<StatsViewModel.Chart.ChartRow> chart = new List<StatsViewModel.Chart.ChartRow>();

            var currentMonthQuery = reportsForQuartal.Where(report => report.DateHappened.Month == DateTime.Now.Month);
            var currentMonthCompleted = currentMonthQuery.Count(report => report.Status == ReportStatus.Completed);
            var currentMonthProcessing = currentMonthQuery.Count(report => report.Status == ReportStatus.Processing);
            var currentMonthFails = currentMonthQuery.Count(report => report.Status == ReportStatus.Failure);
            var currentMonthSummary = currentMonthQuery.Count();

            vm.ThisMonthStats = new StatsViewModel.Chart.ChartRow
            {
                Month = DateTime.Now.ToMonthName(),
                ReportsCount = currentMonthSummary,
                CompletedReportsCount = currentMonthCompleted
            };
            vm.ThisMonthNumbers = new StatsViewModel.Numbers
            {
                ReportsCount = currentMonthSummary,
                ReportsCompleted = currentMonthCompleted,
                ReportsProcessing = currentMonthProcessing,
                ReportsFailed = currentMonthFails
            };
            vm.ThisMonthPercentages = new StatsViewModel.Percentages
            {
                AverageReportsCompleted = (double)currentMonthCompleted / currentMonthSummary * 100.0,
                AverageReportsProcessing = (double)currentMonthProcessing / currentMonthSummary * 100.0,
                AverageReportsFailure = (double)currentMonthFails / currentMonthSummary * 100.0
            };

            chart.Add(vm.ThisMonthStats);

            var offset = new TimeSpan(30, 0, 0, 0);
            for (int i = 0; i < 3; i++)
            {
                chart.Add(BuildChartRow(reportsForQuartal, DateTime.Now - offset));
                offset += new TimeSpan(30, 0, 0, 0);
            }
            vm.ReportsChart = chart.AsReadOnly();
            return vm;
        }

        private StatsViewModel.Chart.ChartRow BuildChartRow(IReadOnlyCollection<Report> reportsForQuartal,
            DateTime dateTime)
        {
            var monthQuery = reportsForQuartal.Where(report => report.DateHappened.Month == dateTime.Month);
            var monthQueryCompleted = monthQuery.Count(report => report.Status == ReportStatus.Completed);
            var monthQuerySummary = monthQuery.Count();
            return new StatsViewModel.Chart.ChartRow
            {
                Month = dateTime.ToMonthName(),
                ReportsCount = monthQuerySummary,
                CompletedReportsCount = monthQueryCompleted
            };
        }
    }
}
