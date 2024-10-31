using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class ChartRepository : IChartRepository
    {
        private readonly HcmUeQTTB_DevContext _context;
        public ChartRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }

        public async Task<List<CampusReportComparisonDto>> GetCampusReportComparison(int? year = null)
        {
            // Sử dụng năm hiện tại nếu year không được truyền vào
            int targetYear = year ?? DateTime.Now.Year;

            var reports = await (from cr in _context.CleaningReports
                                 join cf in _context.CleaningForms on cr.FormId equals cf.Id
                                 join r in _context.Rooms on cf.RoomId equals r.Id
                                 join b in _context.Blocks on r.BlockId equals b.Id
                                 where cr.CreateAt.HasValue && cr.CreateAt.Value.Year == targetYear // Kiểm tra null trước khi lấy Year
                                 select new
                                 {
                                     b.CampusId,
                                     b.CampusName, // Lưu lại tên campus
                                     cr.Value
                                 }).ToListAsync();

            var groupedReports = reports
                .GroupBy(r => new { r.CampusId, r.CampusName }) // Nhóm theo CampusId và CampusName
                .Select(g => new CampusReportComparisonDto
                {
                    CampusName = g.Key.CampusName, // Lấy tên campus từ Key
                    AverageValue = Math.Ceiling(g.Average(r => r.Value ?? 0)), // Làm tròn lên
                    CountNotMet = g.Count(value => (value.Value ?? 0) < 30), // So sánh với thuộc tính Value
                    CountCompleted = g.Count(value => (value.Value ?? 0) >= 30 && (value.Value ?? 0) <= 80), // So sánh với thuộc tính Value
                    CountWellCompleted = g.Count(value => (value.Value ?? 0) > 80) // So sánh với thuộc tính Value
                }).ToList();

            return groupedReports;
        }



        public async Task<CleaningReportSummaryDto> GetCleaningReportSummary(string campusId)
        {
            var today = DateTime.Today;

            // Tạo truy vấn cơ bản lấy thông tin báo cáo trong ngày
            var query = from cr in _context.CleaningReports
                        join cf in _context.CleaningForms on cr.FormId equals cf.Id
                        join r in _context.Rooms on cf.RoomId equals r.Id
                        join b in _context.Blocks on r.BlockId equals b.Id
                        where cr.CreateAt.HasValue && cr.CreateAt.Value.Date == today
                        select new { cr, b.CampusId };

            // Chỉ lọc theo campusId khi campusId có giá trị
            if (!string.IsNullOrEmpty(campusId))
            {
                query = query.Where(q => q.CampusId == campusId);
            }


            var reports = await query.Select(q => q.cr.Value).ToListAsync();


            int totalReportsToday = reports.Count;


            int countNotMet = reports.Count(value => value < 30);
            int countCompleted = reports.Count(value => value >= 30 && value < 80);
            int countWellCompleted = reports.Count(value => value >= 80);


            var reportCounts = new List<CleaningReportDetailDto>
            {
        new CleaningReportDetailDto { Status = "Chưa hoàn thành", Count = countNotMet },
        new CleaningReportDetailDto { Status = "Hoàn thành", Count = countCompleted },
        new CleaningReportDetailDto { Status = "Hoàn thành tốt", Count = countWellCompleted }
    };

            return new CleaningReportSummaryDto
            {
                TotalReportsToday = totalReportsToday,
                ReportCounts = reportCounts
            };
        }



        public async Task<List<ResponsibleTagReportDto>> GetResponsibleTagReportByCampus(string? campusId)
        {
            var today = DateTime.Today;

            var query = from us in _context.UserScores
                        join user in _context.Users on us.UserId equals user.Id
                        join tag in _context.Tags on us.TagId equals tag.Id
                        join cleaningreport in _context.CleaningReports on us.ReportId equals cleaningreport.Id
                        join cleaningform in _context.CleaningForms on cleaningreport.FormId equals cleaningform.Id
                        join rooms in _context.Rooms on cleaningform.RoomId equals rooms.Id
                        join block in _context.Blocks on rooms.BlockId equals block.Id
                        where (campusId == null || block.CampusId == campusId)
                              && us.CreateAt.HasValue
                              && us.CreateAt.Value.Date == today
                        group new { us, cleaningreport } by new { tag.TagName, user.LastName, user.FirstName } into tagGroup
                        select new ResponsibleTagReportDto
                        {
                            TagName = tagGroup.Key.TagName,
                            LastName = tagGroup.Key.LastName,
                            FristName = tagGroup.Key.FirstName,
                            TotalReport = tagGroup.Count(), // Đếm số lượng báo cáo từ UserScores cho mỗi TagName
                            Progress = (int)Math.Ceiling(tagGroup.Average(x => x.us.Score ?? 0)), // Làm tròn tiến độ trung bình từ UserScores
                            Status = tagGroup.Average(x => x.us.Score ?? 0) >= 80 ? "Hoàn thành tốt" : "Cần cải thiện" // Xác định trạng thái
                        };

            var result = await query.ToListAsync();

            return result;
        }
    }
}
