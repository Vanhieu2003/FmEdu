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
        public Task<IEnumerable<ShiftEvaluationSummaryDto>> GetShiftEvaluationsAsync(string? campusId);
        //
        //public Task<List<CampusAverageValueDto>> GetAverageValues(string? campusId);
        public Task<List<CriteriaValueDto>> GetTopCriteriaValuesByCampus(string? campusId);
        public Task<CleaningReportSummaryDto> GetReportInADayAsync();
<<<<<<< HEAD
        // public Task<List<CleaningReportDto>> GetCleaningReportsByYearAsync();
        // public Task<List<BlockReportDto>> GetBlockReportsAsync(string campusId, DateTime? targetDate = null);

        public Task<List<CleaningReportDto>> GetCleaningReportsByQuarter();
=======
       // public Task<List<CleaningReportDto>> GetCleaningReportsByYearAsync();
       // public Task<List<BlockReportDto>> GetBlockReportsAsync(string campusId, DateTime? targetDate = null);

        public Task<List<CleaningReportDto>> GetCleaningReportsByQuarter();
        public Task<List<CleaningReportDto>> GetCleaningReportsByLast10Days();
>>>>>>> ca7b1996c9d43ffd48028a78858f3f86a8081b5c
        public Task<List<CleaningReportDto>> GetCleaningReportsByMonth(int? month = null, int? year = null);
    }
}
