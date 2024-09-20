using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Project.Dto;
using Project.Entities;
using Project.Repository;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CleaningReportsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICleaningReportRepository _repo;

        public CleaningReportsController(HcmUeQTTB_DevContext context, ICleaningReportRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/CleaningReports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CleaningReport>>> GetCleaningReports()
        {
            if (_context.CleaningReports == null)
            {
                return NotFound();
            }
            return await _context.CleaningReports.ToListAsync();
        }

        // GET: api/CleaningReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CleaningReportDetailsDto>> GetCleaningReport(string id)
        {
            if (_context.CleaningReports == null)
            {
                return NotFound();
            }
            var cleaningReport = await _repo.GetInfoByReportId(id);

            if (cleaningReport == null)
            {
                return NotFound();
            }

            return cleaningReport;
        }


        [HttpGet("ByCleaningForm/{formId}")]
        public async Task<IActionResult> GetCleaningReportByCleaningForm(string formId)
        {
            var reports = await _repo.GetCleaningReportByCleaningForm(formId);
            if (reports == null)
            {
                return NotFound();
            }
            return Ok(reports);
        }

        [HttpGet("GetAllInfo")]
        public async Task<IActionResult> GetAllCleaningReport([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            // Kiểm tra các giá trị đầu vào để đảm bảo chúng hợp lệ
            if (pageNumber < 1)
            {
                return BadRequest("Số trang không hợp lệ.");
            }

            if (pageSize <= 0)
            {
                return BadRequest("Kích thước trang không hợp lệ.");
            }

            // Lấy danh sách báo cáo từ repository với phân trang
            var reports = await _repo.GetReportInfo(pageNumber, pageSize);

            // Kiểm tra nếu không tìm thấy báo cáo nào
            if (reports == null || !reports.Any())
            {
                return NotFound("Không tìm thấy báo cáo nào phù hợp với tiêu chí tìm kiếm.");
            }

            // Trả về danh sách báo cáo
            return Ok(reports);
        }

        [HttpGet("ByReportId/{ReportId}")]
        public async Task<IActionResult> GetReportInfoByReportId(string ReportId)
        {
            var report = await _repo.GetInfoByReportId(ReportId);
            if (report == null)
            {
                return NotFound();
            }
            return Ok(report);
        }

        [HttpGet("GetFullInfo/{ReportId}")]
        public async Task<ActionResult> GetReportDetails(string ReportId)
        {
            // Lấy báo cáo từ ReportId
            var report = await _context.CleaningReports.FirstOrDefaultAsync(x => x.Id == ReportId);
            if (report == null)
            {
                return NotFound("Report không tồn tại");
            }
            // Tìm form dựa vào formId
            var formId = await _context.CleaningReports
                .Where(r => r.Id == ReportId)
                .Select(x => x.FormId)
                .FirstOrDefaultAsync();

            var form = await _context.CleaningForms.FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null)
            {
                return NotFound("Form không tồn tại");
            }

            // Tìm thông tin phòng dựa trên RoomId
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == form.RoomId);
            if (room == null)
            {
                return NotFound("Phòng không tồn tại");
            }

            // Lấy thông tin Block, Floor và Campus dựa trên RoomId
            var block = await _context.Blocks.FirstOrDefaultAsync(b => b.Id == room.BlockId);
            if (block == null)
            {
                return NotFound("Block không tồn tại");
            }

            var floor = await _context.Floors.FirstOrDefaultAsync(f => f.Id == room.FloorId);
            if (floor == null)
            {
                return NotFound("Floor không tồn tại");
            }

            var campus = await _context.Campuses.FirstOrDefaultAsync(c => c.Id == block.CampusId);
            if (campus == null)
            {
                return NotFound("Campus không tồn tại");
            }

            // Lấy thông tin shift từ báo cáo
            var shift = await _context.Shifts.FirstOrDefaultAsync(s => s.Id == report.ShiftId);
            if (shift == null)
            {
                return NotFound("Shift không tồn tại");
            }

            // Tìm tất cả các tiêu chí của form từ bảng CriteriaReport
            var criteriaPerReport = await _context.CriteriaReports
                .Where(cpf => cpf.ReportId == ReportId)
                .ToListAsync();

            // Tạo danh sách các tiêu chí và các tag tương ứng
            var criteriaList = new List<object>();
            foreach (var cpr in criteriaPerReport)
            {
                // Tìm thông tin chi tiết về từng tiêu chí
                var criteria = await _context.Criteria
                    .Where(c => c.Id == cpr.CriteriaId)
                    .FirstOrDefaultAsync();

                // Thêm tiêu chí vào danh sách
                criteriaList.Add(new
                {
                    Id = criteria?.Id,
                    Name = criteria?.CriteriaName,
                    CriteriaType = criteria?.CriteriaType,
                    Value = cpr.Value,
                    Note = cpr.Note,
                    ImageUrl = cpr.ImageUrl
                });
            }

            // Tạo object trả về
            var result = new
            {
                Id = ReportId,
                CampusName = campus?.CampusName,
                BlockName = block?.BlockName,
                FloorName = floor?.FloorName, // Lấy FloorName từ Floor
                RoomName = room?.RoomName,
                CriteriaList = criteriaList,
                createAt = report.CreateAt,
                updateAt = report.UpdateAt,
                shiftName = shift.ShiftName,
                startTime = shift.StartTime.ToString(),
                endTime = shift.EndTime.ToString(),
            };

            return Ok(result);
        }

            // PUT: api/CleaningReports/5
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPut("{id}")]
        public async Task<IActionResult> PutCleaningReport(string id, CleaningReport cleaningReport)
        {
            if (id != cleaningReport.Id)
            {
                return BadRequest();
            }

            _context.Entry(cleaningReport).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CleaningReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCriteriaAndCleaningReport([FromBody] UpdateCleaningReportRequest request)
        {
            // 1. Kiểm tra xem CleaningReport có tồn tại không dựa trên ReportId
            var cleaningReport = await _context.CleaningReports
                .FirstOrDefaultAsync(cr => cr.Id == request.ReportId);

            if (cleaningReport == null)
            {
                return NotFound("CleaningReport không tồn tại.");
            }

            // 2. Cập nhật các giá trị và ghi chú trong CriteriaReport dựa trên CriteriaList
            foreach (var criteriaDto in request.CriteriaList)
            {
                // Tìm CriteriaReport theo CriteriaId và ReportId
                var criteriaReport = await _context.CriteriaReports
                    .FirstOrDefaultAsync(cr => cr.CriteriaId == criteriaDto.Id && cr.ReportId == request.ReportId);

                if (criteriaReport == null)
                {
                    return NotFound($"CriteriaReport với CriteriaId '{criteriaDto.Id}' không tồn tại cho ReportId '{request.ReportId}'.");
                }

                // Cập nhật giá trị và ghi chú của CriteriaReport
                criteriaReport.Value = criteriaDto.Value;
                criteriaReport.ReportId = request.ReportId;
                criteriaReport.Note = criteriaDto.Note;
                criteriaReport.UpdateAt = DateTime.UtcNow;

                _context.CriteriaReports.Update(criteriaReport);
            }

            // Lưu thay đổi sau khi cập nhật tất cả CriteriaReports
            await _context.SaveChangesAsync();

            // 3. Tính toán lại giá trị tổng hợp và cập nhật CleaningReport
            var criteriaReports = await _context.CriteriaReports
                .Where(cr => cr.ReportId == request.ReportId)
                .ToListAsync();

            // Lấy danh sách các tiêu chí tương ứng với CriteriaReports
            var criteriaList = await _context.Criteria
                .Where(c => criteriaReports.Select(cr => cr.CriteriaId).Contains(c.Id))
                .ToListAsync();

            // Tính tổng giá trị tối đa dựa trên loại tiêu chí (BINARY hoặc dạng khác)
            var totalMaxValue = criteriaList.Sum(c => c.CriteriaType == "BINARY" ? 2 : 5);
            var totalValue = criteriaReports.Sum(cr => cr.Value ?? 0);

            // Tính tỷ lệ phần trăm dựa trên giá trị tối đa và giá trị thực tế
            var percentage = totalMaxValue > 0 ? (double)totalValue / totalMaxValue * 100 : 0;

            // Làm tròn tỷ lệ phần trăm
            var roundedPercentage = Math.Round(percentage, 2);

            // Cập nhật giá trị trung bình vào CleaningReport
            cleaningReport.Value = (int)roundedPercentage;
            cleaningReport.UpdateAt = DateTime.UtcNow;

            // Lưu thay đổi vào CleaningReport
            _context.CleaningReports.Update(cleaningReport);
            await _context.SaveChangesAsync();

            return Ok(cleaningReport);
        }

        [HttpPost("create")]
        public async Task<ActionResult<CleaningReport>> CreateCleaningReport([FromBody] CleaningReportRequest request)
        {
            if (_context.CleaningReports == null)
            {
                return Problem("Entity set 'HcmUeQTTB_DevContext.CleaningReports' is null.");
            }

            if (request == null || request.CriteriaList == null || !request.CriteriaList.Any())
            {
                return BadRequest("Invalid request data.");
            }

            // 1. Tạo một bản ghi CleaningReport mới
            var cleaningReport = new CleaningReport
            {
                Id = Guid.NewGuid().ToString(),
                FormId = request.FormId,
                ShiftId = request.ShiftId,
                Value = 0, // Giá trị mặc định ban đầu
                UserId = request.userId,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            };

            // 2. Lưu CleaningReport vào database
            _context.CleaningReports.Add(cleaningReport);
            await _context.SaveChangesAsync();
            var reportId = cleaningReport.Id;

            // 3. Lưu các CriteriaReport vào database
            foreach (var criteria in request.CriteriaList)
            {
                if (string.IsNullOrWhiteSpace(criteria.CriteriaId) || criteria.Value == null)
                {
                    continue; // Bỏ qua các tiêu chí không hợp lệ
                }

                var criteriaReport = new CriteriaReport
                {
                    Id = Guid.NewGuid().ToString(),
                    ReportId = reportId,
                    CriteriaId = criteria.CriteriaId,
                    Value = criteria.Value,
                    Note = criteria.Note,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow,
                    FormId = request.FormId, // Đảm bảo FormId không NULL
                    ImageUrl = JsonConvert.SerializeObject(criteria.Images)
                };
                _context.CriteriaReports.Add(criteriaReport);
            }

            await _context.SaveChangesAsync(); // Lưu vào database

            // 4. Tính toán giá trị trung bình từ các tiêu chí
            // Lấy danh sách các CriteriaReport liên quan đến reportId
            var criteriaReports = await _context.CriteriaReports
                .Where(cr => cr.ReportId == reportId)
                .ToListAsync();

            // Lấy danh sách các tiêu chí
            var criteriaList = await _context.Criteria
                .Where(c => criteriaReports.Select(cr => cr.CriteriaId).Contains(c.Id))
                .ToListAsync();

            // Tính tổng giá trị tối đa và tổng giá trị thực tế
            var totalMaxValue = criteriaList.Sum(c => c.CriteriaType == "BINARY" ? 2 : 5);
            var totalValue = criteriaReports.Sum(cr => cr.Value ?? 0);

            // Tính tỷ lệ phần trăm
            var percentage = totalMaxValue > 0 ? (double)totalValue / totalMaxValue * 100 : 0;

            // Làm tròn tỷ lệ phần trăm
            var roundedPercentage = Math.Round(percentage, 2);

            // Cập nhật giá trị trung bình vào bảng CleaningReport
            cleaningReport.Value = (int)roundedPercentage; // Hoặc lưu giá trị phần trăm ở định dạng khác nếu cần
            cleaningReport.UpdateAt = DateTime.UtcNow;
            _context.CleaningReports.Update(cleaningReport);

            await _context.SaveChangesAsync(); // Lưu vào database

            // Trả về CleaningReport đã được cập nhật
            return Ok(cleaningReport);
        }

        // DELETE: api/CleaningReports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCleaningReport(string id)
        {
            if (_context.CleaningReports == null)
            {
                return NotFound();
            }
            var cleaningReport = await _context.CleaningReports.FindAsync(id);
            if (cleaningReport == null)
            {
                return NotFound();
            }

            _context.CleaningReports.Remove(cleaningReport);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CleaningReportExists(string id)
        {
            return (_context.CleaningReports?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
