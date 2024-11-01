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
            int targetYear = year ?? DateTime.Now.Year;

            var reports = await (from cr in _context.CleaningReports
                                 join cf in _context.CleaningForms on cr.FormId equals cf.Id
                                 join r in _context.Rooms on cf.RoomId equals r.Id
                                 join b in _context.Blocks on r.BlockId equals b.Id
                                 where cr.CreateAt.HasValue && cr.CreateAt.Value.Year == targetYear
                                 select new
                                 {
                                     b.CampusId,
                                     b.CampusName,
                                     cr.Value
                                 }).ToListAsync();

            var groupedReports = reports
                .GroupBy(r => new { r.CampusId, r.CampusName })
                .Select(g => new CampusReportComparisonDto
                {
                    CampusName = g.Key.CampusName,
                    AverageValue = Math.Ceiling(g.Average(r => r.Value ?? 0)),
                    CountNotMet = g.Count(value => (value.Value ?? 0) < 30),
                    CountCompleted = g.Count(value => (value.Value ?? 0) >= 30 && (value.Value ?? 0) <= 80),
                    CountWellCompleted = g.Count(value => (value.Value ?? 0) > 80)
                }).ToList();

            return groupedReports.Any() ? groupedReports : new List<CampusReportComparisonDto>();
        }




        public async Task<CleaningReportSummaryDto> GetCleaningReportSummary(string campusId)
        {
            var today = DateTime.Today;

            var query = from cr in _context.CleaningReports
                        join cf in _context.CleaningForms on cr.FormId equals cf.Id
                        join r in _context.Rooms on cf.RoomId equals r.Id
                        join b in _context.Blocks on r.BlockId equals b.Id
                        where cr.CreateAt.HasValue && cr.CreateAt.Value.Date == today
                        select new { cr, b.CampusId };

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
                            TotalReport = tagGroup.Count(),
                            Progress = (int)Math.Ceiling(tagGroup.Average(x => x.us.Score ?? 0)),
                            Status = tagGroup.Average(x => x.us.Score ?? 0) >= 80 ? "Hoàn thành tốt" : "Cần cải thiện"
                        };

            var result = await query.ToListAsync();
            return result.Any() ? result : new List<ResponsibleTagReportDto>();
        }


        public async Task<List<RoomGroupReportDto>> GetRoomGroupReportByCampus(string? campusId)
        {
            var today = DateTime.Today;

            var query = from roomgroup in _context.RoomByGroups
                        join rooms in _context.Rooms on roomgroup.RoomId equals rooms.Id
                        join grouprooms in _context.GroupRooms on roomgroup.GroupRoomId equals grouprooms.Id
                        join block in _context.Blocks on rooms.BlockId equals block.Id
                        where campusId == null || block.CampusId == campusId
                        group new { rooms, roomgroup } by new { grouprooms.GroupName } into Group
                        select new
                        {
                            GroupName = Group.Key.GroupName,
                            TotalRoom = Group.Select(g => g.rooms.Id).Distinct().Count()
                        };

            var evaluatedQuery = from roomgroup in _context.RoomByGroups
                                 join rooms in _context.Rooms on roomgroup.RoomId equals rooms.Id
                                 join grouprooms in _context.GroupRooms on roomgroup.GroupRoomId equals grouprooms.Id
                                 join cleaningform in _context.CleaningForms on rooms.Id equals cleaningform.RoomId
                                 join cleaningreport in _context.CleaningReports on cleaningform.Id equals cleaningreport.FormId
                                 join block in _context.Blocks on rooms.BlockId equals block.Id
                                 where (campusId == null || block.CampusId == campusId) &&
                                       cleaningreport.CreateAt.HasValue &&
                                       cleaningreport.CreateAt.Value.Date == today
                                 group cleaningreport by new { grouprooms.GroupName } into Group
                                 select new
                                 {
                                     GroupName = Group.Key.GroupName,
                                     TotalEvaluatedRoom = Group.Count(),
                                     AverageScore = Group.Average(g => g.Value ?? 0)
                                 };

            var roomGroups = await query.ToListAsync();
            var evaluatedRooms = await evaluatedQuery.ToListAsync();

            var result = (from rg in roomGroups
                          join er in evaluatedRooms on rg.GroupName equals er.GroupName into evaluatedGroup
                          from eg in evaluatedGroup.DefaultIfEmpty()
                          select new RoomGroupReportDto
                          {
                              GroupName = rg.GroupName,
                              TotalRoom = rg.TotalRoom,
                              TotalEvaluatedRoom = eg?.TotalEvaluatedRoom ?? 0,
                              Progress = eg != null ? (int)Math.Ceiling(eg.AverageScore) : 0,
                              Status = eg != null
                                  ? eg.AverageScore > 80 ? "Hoàn thành tốt"
                                    : eg.AverageScore < 30 ? "Chưa hoàn thành"
                                    : "Cần cải thiện"
                                  : "Chưa hoàn thành"
                          }).ToList();

            return result.Any() ? result : new List<RoomGroupReportDto>();
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


        public async Task<IEnumerable<ShiftEvaluationSummaryDto>> GetShiftEvaluationsAsync(string? campusId = null)
        {
            var today = DateTime.Today;

            var query = from cleaningreport in _context.CleaningReports
                        join cleaningform in _context.CleaningForms on cleaningreport.FormId equals cleaningform.Id
                        join rooms in _context.Rooms on cleaningform.RoomId equals rooms.Id
                        join block in _context.Blocks on rooms.BlockId equals block.Id
                        join shifts in _context.Shifts on cleaningreport.ShiftId equals shifts.Id
                        where cleaningreport.CreateAt.HasValue
                              && cleaningreport.CreateAt.Value.Date == today
                              && (string.IsNullOrEmpty(campusId) || block.CampusId == campusId)
                        group cleaningreport by new
                        {
                            shifts.ShiftName,
                            shifts.StartTime,
                            shifts.EndTime,
                            EvaluationDate = cleaningreport.CreateAt.Value.Date
                        } into Group
                        select new ShiftEvaluationSummaryDto
                        {
                            ShiftName = Group.Key.ShiftName,
                            ShiftTime = $"{Group.Key.StartTime:hh\\:mm} - {Group.Key.EndTime:hh\\:mm}",
                            TotalEvaluations = Group.Count(),
                            AverageCompletionPercentage = Group.Any(g => g.Value != null)
                                ? (int)Math.Round(Group.Average(g => g.Value ?? 0))
                                : 0,
                            EvaluationDate = Group.Key.EvaluationDate
                        };

            return await query.OrderBy(dto => dto.EvaluationDate)
                               .ThenBy(dto => dto.ShiftName)
                               .ToListAsync();
        }

    }
}
