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
                            FirstName = tagGroup.Key.FirstName,
                            TotalReport = tagGroup.Count(), // Đếm số lượng báo cáo từ UserScores cho mỗi TagName
                            Progress = (int)Math.Ceiling(tagGroup.Average(x => x.us.Score ?? 0)), // Làm tròn tiến độ trung bình từ UserScores
                            Status = tagGroup.Average(x => x.us.Score ?? 0) >= 80 ? "Hoàn thành tốt" : "Cần cải thiện" // Xác định trạng thái
                        };

            var result = await query.ToListAsync();

            return result;
        }

        public async Task<List<RoomGroupReportDto>> GetRoomGroupReportByCampus(string? campusId)
        {
            var today = DateTime.Today;

            var query = from roomgroup in _context.RoomByGroups
                        join rooms in _context.Rooms on roomgroup.RoomId equals rooms.Id
                        join grouprooms in _context.GroupRooms on roomgroup.GroupRoomId equals grouprooms.Id
                        join cleaningform in _context.CleaningForms on rooms.Id equals cleaningform.RoomId
                        join cleaningreport in _context.CleaningReports on cleaningform.Id equals cleaningreport.FormId
                        join block in _context.Blocks on rooms.BlockId equals block.Id
                        where (campusId == null || block.CampusId == campusId)
                              && cleaningreport.CreateAt.HasValue
                              && cleaningreport.CreateAt.Value.Date == today
                        group new { rooms, cleaningreport } by new { grouprooms.GroupName } into Group
                        select new
                        {
                            GroupName = Group.Key.GroupName,
                            TotalRoom = Group.Select(g => g.rooms.Id).Distinct().Count(),
                            TotalEvaluatedRoom = Group.Count(g => g.cleaningreport != null),
                            AverageScore = Group.Average(g => g.cleaningreport.Value ?? 0)
                        };

            var result = await query.ToListAsync();

            // Xử lý thêm sau khi truy vấn
            var roomGroupReports = result.Select(x => new RoomGroupReportDto
            {
                GroupName = x.GroupName,
                TotalRoom = x.TotalRoom,
                TotalEvaluatedRoom = x.TotalEvaluatedRoom,
                Progress = (int)Math.Ceiling(x.AverageScore),
                Status = x.AverageScore > 80 ? "Hoàn thành tốt" : x.AverageScore < 30 ? "Chưa hoàn thành" : "Cần cải thiện"
            }).ToList();

            return roomGroupReports;
        }


        public async Task<List<CampusDetailReportDto>> GetCampusDetailReportById(string? campusId)
        {
            var today = DateTime.Today;

            var query = from rooms in _context.Rooms
                        join cleaningform in _context.CleaningForms on rooms.Id equals cleaningform.RoomId
                        join cleaningreport in _context.CleaningReports on cleaningform.Id equals cleaningreport.FormId
                        join block in _context.Blocks on rooms.BlockId equals block.Id
                        where (campusId == null || block.CampusId == campusId)
                              && cleaningreport.CreateAt.HasValue
                              && cleaningreport.CreateAt.Value.Date == today
                        group cleaningreport by rooms.Id into roomGroup
                        select new
                        {
                            RoomId = roomGroup.Key,
                            AverageScore = roomGroup.Average(r => r.Value ?? 0)
                        };

            var result = await query.ToListAsync();

            // Tính toán tổng số lượng phòng và các mức độ hoàn thành
            int totalRooms = result.Count;
            int wellCompletedRooms = result.Count(r => r.AverageScore > 80);
            int notMetRooms = result.Count(r => r.AverageScore < 30);
            int completedRooms = totalRooms - wellCompletedRooms - notMetRooms;

            // Tính tỷ lệ phần trăm cho từng mức độ
            double wellCompletedPercentage = totalRooms > 0 ? (double)wellCompletedRooms / totalRooms * 100 : 0;
            double notMetPercentage = totalRooms > 0 ? (double)notMetRooms / totalRooms * 100 : 0;
            double completedPercentage = totalRooms > 0 ? (double)completedRooms / totalRooms * 100 : 0;

            // Tạo danh sách kết quả
            var campusDetailReports = new List<CampusDetailReportDto>
    {
        new CampusDetailReportDto
        {
            TotalReport = wellCompletedRooms,
            Proportion = (int)Math.Round(wellCompletedPercentage),
            Status = "Hoàn thành tốt"
        },
        new CampusDetailReportDto
        {
            TotalReport = notMetRooms,
            Proportion = (int)Math.Round(notMetPercentage),
            Status = "Chưa hoàn thành"
        },
        new CampusDetailReportDto
        {
            TotalReport = completedRooms,
            Proportion = (int)Math.Round(completedPercentage),
            Status = "Hoàn thành"
        }
    };

            return campusDetailReports;
        }
    }
}
