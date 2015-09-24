namespace Emergy.Api.Models
{
    public class PerformanceModel
    {
        public PerformanceModel()
        {
            
        }
        public PerformanceModel(string cpuUsage, string ramUsage)
        {
            CpuUsage = cpuUsage;
            RamUsage = ramUsage;
        }
        public string CpuUsage { get; set; }
        public string RamUsage { get; set; }
    }
}
