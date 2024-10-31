using Project.Dto;

namespace Project.Interface
{
    public interface IChartRepository
    {
        public Task<CleaningReportSummaryDto> GetCleaningReportSummary(string campusId);
        public Task<List<CampusReportComparisonDto>> GetCampusReportComparison(int? year = null);
        public Task<List<ResponsibleTagReportDto>> GetResponsibleTagReportByCampus(string? campusId);
    }
}
