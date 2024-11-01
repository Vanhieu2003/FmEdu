using Project.Dto;

namespace Project.Interface
{
    public interface IChartRepository
    {
        public Task<CleaningReportSummaryDto> GetCleaningReportSummary(string? campusId);
        public Task<List<CampusReportComparisonDto>> GetCampusReportComparison(int? year = null);
        public Task<List<ResponsibleTagReportDto>> GetResponsibleTagReportByCampus(string? campusId);
        public Task<List<RoomGroupReportDto>> GetRoomGroupReportByCampus(string? campusId);
        public Task<List<CampusDetailReportDto>> GetCampusDetailReportById(string? campusId);
        public Task<IEnumerable<ShiftEvaluationSummaryDto>> GetShiftEvaluationsAsync(string campusId);
    }
}
