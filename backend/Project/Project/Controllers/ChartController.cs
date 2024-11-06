using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IChartRepository _repo;

        public ChartController(HcmUeQTTB_DevContext context, IChartRepository chartRepository)
        {
            _context = context;
            _repo = chartRepository;
        }
        
        
        [HttpGet("GetTopCriteriaValuesByCampus")]
        public async Task<IActionResult> GetTopCriteriaValuesByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetTopCriteriaValuesByCampus(campusId);
            return Ok(result);
        }

        [HttpGet("GetCleaningReportsByQuarter")]
        public async Task<IActionResult> GetCleaningReportsByQuarter()
        {
            var result = await _repo.GetCleaningReportsByQuarter();
            return Ok(result);
        }


        [HttpGet("GetCleaningReportsByMonth")]
        public async Task<IActionResult> GetCleaningReportsByMonth(int? month = null, int? year = null)
        {
            // Sử dụng tháng và năm hiện tại nếu không có tham số truyền vào
            int currentMonth = month ?? DateTime.Now.Month;
            int currentYear = year ?? DateTime.Now.Year;

            // Tạo danh sách tất cả các ngày trong tháng đã chọn
            var daysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(currentYear, currentMonth))
                .Select(day => new DateTime(currentYear, currentMonth, day))
                .ToList();

            var campuses = await _context.Campuses.ToListAsync();
            var blocks = await _context.Blocks.ToListAsync();
            var rooms = await _context.Rooms.ToListAsync();
            var cleaningForms = await _context.CleaningForms.ToListAsync();
            var cleaningReports = await _context.CleaningReports.ToListAsync();

            var result = daysInMonth
                .Select(day => new
                {
                    ReportDate = day,
                    CampusData = campuses.Select(c => new
                    {
                        CampusName = c.CampusName,
                        AverageValue = (
                            from cr in cleaningReports
                            join cf in cleaningForms on cr.FormId equals cf.Id
                            join r in rooms on cf.RoomId equals r.Id
                            join b in blocks on r.BlockId equals b.Id
                            where b.CampusId == c.Id &&
                                  cr.UpdateAt.HasValue &&
                                  cr.UpdateAt.Value.Date == day  // Lọc theo từng ngày trong tháng
                            select cr.Value
                        ).Average(crValue => (double?)crValue) ?? 0
                    })
                })
                .SelectMany(x => x.CampusData.Select(cd => new CleaningReportDto
                {
                    CampusName = cd.CampusName,
                    ReportTime = x.ReportDate.ToString("dd-MM-yyyy"),
                    AverageValue = (int)cd.AverageValue
                }))
                .OrderBy(x => x.ReportTime)  // Sắp xếp kết quả theo thứ tự ngày từ đầu đến cuối tháng
                .ToList();

            return Ok(result);
        }



        [HttpGet("GetCleaningReportsByLast10Days")]
        public async Task<IActionResult> GetCleaningReportsByLast10Days()
        {
            var last10Days = Enumerable.Range(0, 10)
                .Select(i => DateTime.Now.Date.AddDays(-i))
                .OrderBy(d => d)
                .ToList();

            var campuses = await _context.Campuses.ToListAsync();
            var blocks = await _context.Blocks.ToListAsync();
            var rooms = await _context.Rooms.ToListAsync();
            var cleaningForms = await _context.CleaningForms.ToListAsync();
            var cleaningReports = await _context.CleaningReports.ToListAsync();

            var result = last10Days
                .Select(day => new
                {
                    ReportDate = day,
                    CampusData = campuses.Select(c => new
                    {
                        CampusName = c.CampusName,
                        AverageValue = (
                            from cr in cleaningReports
                            join cf in cleaningForms on cr.FormId equals cf.Id
                            join r in rooms on cf.RoomId equals r.Id
                            join b in blocks on r.BlockId equals b.Id
                            where b.CampusId == c.Id &&
                                  cr.UpdateAt.HasValue &&
                                  cr.UpdateAt.Value.Date == day
                            select cr.Value
                        ).Average(crValue => (double?)crValue) ?? 0
                    })
                })
                .SelectMany(x => x.CampusData.Select(cd => new CleaningReportDto
                {
                    CampusName = cd.CampusName,
                    ReportTime = x.ReportDate.ToString("dd-MM-yyyy"),
                    AverageValue = (int)cd.AverageValue
                }))
                .OrderBy(x => x.ReportTime)
                .ToList();

            return Ok(result);
        }








        //mới làm
        [HttpGet("GetBlockReports")]
        public async Task<IActionResult> GetBlockReports([FromQuery] string campusId, [FromQuery] DateTime? targetDate = null)
        {
            var result = await _repo.GetBlockReportsAsync(campusId, targetDate);
            return Ok(result);
        }



       

        [HttpGet("comparison")]
        public async Task<IActionResult> GetCampusReportComparison(int? year = null)
        {
            var result = await _repo.GetCampusReportComparison(year);
            return Ok(result);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetCleaningReportSummary([FromQuery] string? campusId)
        {
            var result = await _repo.GetCleaningReportSummary(campusId);
            return Ok(result);
        }

        [HttpGet("responsible-tag-report")]
        public async Task<IActionResult> GetResponsibleTagReportByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetResponsibleTagReportByCampus(campusId);
            return Ok(result);
        }

        [HttpGet("room-group-report")]
        public async Task<IActionResult> GetRoomGroupReportByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetRoomGroupReportByCampus(campusId);
            return Ok(result);
        }

        [HttpGet("detail-report")]
        public async Task<IActionResult> GetCampusDetailReportById([FromQuery] string? campusId)
        {
            var result = await _repo.GetCampusDetailReportById(campusId);
            return Ok(result);
        }

        [HttpGet("GetShiftEvaluations")]
        public async Task<IActionResult> GetShiftEvaluations([FromQuery] string? campusId = null)
        {
            var evaluations = await _repo.GetShiftEvaluationsAsync(campusId);
            return Ok(evaluations);
        }

    }

}



