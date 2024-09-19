using Project.Dto;
using Project.Entities;

namespace Project.Repository
{
    public interface ICleaningReportRepository
    {
        public Task<List<CleaningReport>> GetReportsByShiftId(string shiftId);
        public Task<List<CleaningReport>> GetCleaningReportByCleaningForm(string formId);

        public Task<CleaningReportDetailsDto> GetInfoByReportId(string reportId);

        public Task<List<CleaningReportDetailsDto>> GetReportInfo(int pageNumber = 1, int pageSize = 10);
    }

}

