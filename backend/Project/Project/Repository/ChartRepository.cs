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
        public async Task<List<CampusAverageValueDto>> GetAverageValues(string campusId)
        {
            var currentYear = DateTime.Now.Year;
            var currentMonth = DateTime.Now.Month;
            var daysInMonth = DateTime.DaysInMonth(currentYear, currentMonth);

            var query = from cr in _context.CleaningReports
                        join cf in _context.CleaningForms on cr.FormId equals cf.Id
                        join r in _context.Rooms on cf.RoomId equals r.Id
                        join b in _context.Blocks on r.BlockId equals b.Id
                        join c in _context.Campuses on b.CampusId equals c.Id
                        where (campusId == null || c.Id == campusId)
                              && cr.UpdateAt.HasValue
                              && cr.UpdateAt.Value.Year == currentYear
                              && cr.UpdateAt.Value.Month == currentMonth
                        group cr by new { c.CampusName, Day = cr.UpdateAt.Value.Day } into grouped
                        select new CampusAverageValueDto
                        {
                            CampusName = grouped.Key.CampusName,
                            Day = grouped.Key.Day,
                            AverageValue = (int?)grouped.Where(x => x.Value.HasValue).Average(x => x.Value.Value)
                        };

            var averageValues = await query.ToListAsync();

            // Tạo danh sách kết quả để bao gồm tất cả các ngày trong tháng
            var results = new List<CampusAverageValueDto>();
            for (int day = 1; day <= daysInMonth; day++)
            {
                var value = averageValues.FirstOrDefault(x => x.Day == day);
                results.Add(new CampusAverageValueDto
                {
                    CampusName = value?.CampusName ?? "Không có dữ liệu", // Tùy chỉnh tên cơ sở
                    Day = day,
                    AverageValue = value?.AverageValue ?? 0 // Đặt 0 nếu không có giá trị trung bình
                });
            }

            return results.OrderBy(x => x.Day).ToList();
        }

        public async Task<List<CriteriaValueDto>> GetTopCriteriaValuesByCampus(string campusId)
        {
            var query = from cf in _context.CleaningForms
                        join crr in _context.CriteriaReports on cf.Id equals crr.FormId
                        join cr in _context.Criteria on crr.CriteriaId equals cr.Id
                        join r in _context.Rooms on cf.RoomId equals r.Id
                        join b in _context.Blocks on r.BlockId equals b.Id
                        join ca in _context.Campuses on b.CampusId equals ca.Id
                        where string.IsNullOrEmpty(campusId) || ca.Id == campusId
                        group new { crr, cr, ca } by new { ca.CampusName, cr.CriteriaName, cr.CriteriaType } into grouped
                        select new CriteriaValueDto
                        {
                            CampusName = grouped.Key.CampusName,
                            CriteriaName = grouped.Key.CriteriaName,
                            Value = grouped.Key.CriteriaType == "RATING"
                                    ? (int)Math.Ceiling((double)(grouped.Sum(x => x.crr.Value) / (grouped.Count() * 5.0)) * 100)
                                    : grouped.Key.CriteriaType == "BINARY"
                                    ? (int)Math.Ceiling((double)(grouped.Sum(x => x.crr.Value) / (grouped.Count() * 2.0)) * 100)
                                    : 0
                        };

            var result = await query.OrderByDescending(x => x.Value)
                                     .Take(5)
                                     .ToListAsync();

            return result;
        }
        public async Task<CleaningReportSummaryDto> GetReportInADayAsync()
        {
            var today = DateTime.Today;

            var totalRooms = await _context.CleaningForms.CountAsync();

            var totalReportsToday = await _context.CleaningReports
                .Where(cr => EF.Functions.DateDiffDay(cr.UpdateAt, today) == 0)
                .Select(cr => cr.FormId)
                .Distinct()
                .CountAsync();

            var result = new CleaningReportSummaryDto
            {
                TotalReportsToday = totalReportsToday,
                ReportCounts = new List<CleaningReportDetailDto>
            {
                new CleaningReportDetailDto
                {
                    Status = "Total Rooms",
                    Count = totalRooms
                }
            }
            };

            return result;
        }
        public async Task<List<CleaningReportDto>> GetCleaningReportsByYearAsync()
        {
            var currentYear = DateTime.Now.Year;

            // Tạo danh sách tháng từ 1 đến 12
            var months = Enumerable.Range(1, 12).ToList();

            // Thực hiện truy vấn LINQ
            var query = from month in months
                        from campus in _context.Campuses
                        join block in _context.Blocks on campus.Id equals block.CampusId into campusBlocks
                        from block in campusBlocks.DefaultIfEmpty()
                        join room in _context.Rooms on block.Id equals room.BlockId into blockRooms
                        from room in blockRooms.DefaultIfEmpty()
                        join cleaningForm in _context.CleaningForms on room.Id equals cleaningForm.RoomId into roomForms
                        from cleaningForm in roomForms.DefaultIfEmpty()
                        join cleaningReport in _context.CleaningReports on cleaningForm.Id equals cleaningReport.FormId into formReports
                        from cleaningReport in formReports.DefaultIfEmpty()
                        where cleaningReport != null
                              && cleaningReport.UpdateAt.HasValue // Kiểm tra có giá trị không
                              && cleaningReport.UpdateAt.Value.Year == currentYear
                              && cleaningReport.UpdateAt.Value.Month == month
                        group cleaningReport by new { CampusName = campus.CampusName, Month = month, Year = currentYear } into grouped
                        select new CleaningReportDto
                        {
                            CampusName = grouped.Key.CampusName,
                            ReportTime = $"{grouped.Key.Month:D2}-{grouped.Key.Year}",
                            // Tính giá trị trung bình, cần đảm bảo rằng nó không null
                            AverageValue = grouped.Any() ? (int?)grouped.Average(cr => cr.Value) : null
                        };

            // Chuyển đổi về IQueryable trước khi gọi ToListAsync
            var result = await query.AsQueryable().OrderBy(r => r.ReportTime).ToListAsync();

            return result;
        }
        public async Task<List<BlockReportDto>> GetBlockReportsAsync(string campusId, DateTime? targetDate = null)
        {
            DateTime dateToUse = targetDate ?? DateTime.Today;

            var query = from block in _context.Blocks
                        join room in _context.Rooms on block.Id equals room.BlockId into blockRooms
                        from room in blockRooms.DefaultIfEmpty()
                        join form in _context.CleaningForms on room.Id equals form.RoomId into roomForms
                        from form in roomForms.DefaultIfEmpty()
                        join report in _context.CleaningReports on form.Id equals report.FormId into formReports
                        from report in formReports.DefaultIfEmpty()
                        where block.CampusId == campusId
                              && (report == null || report.UpdateAt.Value.Date == dateToUse.Date)
                        group new { room, report } by new { block.Id, block.BlockName } into grouped
                        select new BlockReportDto
                        {
                            BlockName = grouped.Key.BlockName,
                            TotalRooms = grouped.Count(x => x.room != null),
                            TotalEvaluatedRooms = grouped.Count(x => x.report != null && x.report.UpdateAt.HasValue && x.report.UpdateAt.Value.Date == dateToUse.Date),
                            AverageCompletionValue = (int)Math.Round(grouped.Average(x => x.report != null ? x.report.Value : 0) ?? 0, 2),
                            CompletionPercentage = (int)Math.Round(grouped.Count(x => x.report != null && x.report.UpdateAt.HasValue && x.report.UpdateAt.Value.Date == dateToUse.Date) * 100.0 / grouped.Count(x => x.room != null))
                        };

            return await query.OrderByDescending(x => x.CompletionPercentage).ToListAsync();
        }

    }
}
