using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Project.Dto;
using Project.Entities;
using Project.Interface;


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
            var totalValue = await _context.CleaningReports.CountAsync();
            // Trả về danh sách báo cáo
            var response = new { reports, totalValue };
            return Ok(response);
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

            // Tìm danh sách người dùng dựa vào shiftId, roomId và criteriaIds
            var criteriaIds = criteriaPerReport.Select(c => c.CriteriaId).ToList();

            // Bước 1: Lấy thời gian startTime và endTime của Shift
            var shiftTime = await _context.Shifts
                .Where(s => s.Id == shift.Id)
                .Select(s => new { s.StartTime, s.EndTime })
                .FirstOrDefaultAsync();

            // Bước 2: Lấy danh sách Schedule trong khoảng thời gian của shift
            var schedules = await _context.Schedules
                .Where(s => s.Start.TimeOfDay <= shiftTime.StartTime && s.End.TimeOfDay >= shiftTime.EndTime)
                .Select(s => s.Id)
                .ToListAsync();

            // Bước 3: Tìm kiếm trong bảng ScheduleDetail các scheduleId và roomId trùng khớp
            var userIds = await _context.ScheduleDetails
                .Where(sd => schedules.Contains(sd.ScheduleId) && sd.RoomId == room.Id)
                .Select(sd => sd.UserId)
                .Distinct()
                .ToListAsync();

            // Bước 4: Lấy danh sách TagId từ bảng TagsPerCriteria dựa trên danh sách criteriaIds
            var tagIdsFromCriteria = await _context.TagsPerCriteria
                .Where(tpc => criteriaIds.Contains(tpc.CriteriaId))
                .Select(tpc => tpc.TagId)
                .Distinct()
                .ToListAsync();

            // Bước 5: Lấy danh sách TagId và UserId từ bảng UserPerTag dựa vào userIds
            var userPerTags = await _context.UserPerTags
                .Where(upt => userIds.Contains(upt.UserId) && tagIdsFromCriteria.Contains(upt.TagId))
                .ToListAsync();

            // Bước 6: Lấy danh sách tất cả các Tag tương ứng với tagIds từ bảng Tags
            var tags = await _context.Tags
                .Where(t => tagIdsFromCriteria.Contains(t.Id))
                .ToListAsync();

            // Bước 7: Tạo một danh sách để trả về kết quả, gồm cả những Tag không có User nào
            var userResult = new List<object>();

            // Xử lý tất cả các tags lấy được từ criteria
            foreach (var tag in tags)
            {
                // Lấy tất cả các userId trong bảng UserPerTag tương ứng với tag.Id
                var usersInTag = userPerTags
                    .Where(upt => upt.TagId == tag.Id)
                    .Select(upt => upt.UserId)
                    .ToList();

                // Lấy thông tin các User dựa trên danh sách userIds trong tag này
                var users = await _context.Users
                    .Where(u => usersInTag.Contains(u.Id))
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email
                    })
                    .ToListAsync();

                // Thêm kết quả vào danh sách
                userResult.Add(new
                {
                    TagName = tag.TagName,
                    Users = users // Trả về danh sách Users, nếu không có sẽ là danh sách rỗng
                });
            }

            // Bước 8: Đối với các TagId không có người dùng nào, thêm vào kết quả với danh sách Users rỗng
            foreach (var tagId in tagIdsFromCriteria.Except(tags.Select(t => t.Id)))
            {
                var tagName = await _context.Tags
                    .Where(t => t.Id == tagId)
                    .Select(t => t.TagName)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(tagName))
                {
                    userResult.Add(new
                    {
                        TagName = tagName,
                        Users = new List<object>() // Trả về danh sách Users rỗng nếu không có
                    });
                }
            }

            // Tạo object trả về
            var result = new
            {
                Id = ReportId,
                CampusName = campus?.CampusName,
                BlockName = block?.BlockName,
                FloorName = floor?.FloorName,
                RoomName = room?.RoomName,
                CriteriaList = criteriaList,
                createAt = report.CreateAt,
                updateAt = report.UpdateAt,
                shiftName = shift.ShiftName,
                startTime = shift.StartTime.ToString(),
                endTime = shift.EndTime.ToString(),
                UsersByTags = userResult // Thêm danh sách Users theo tags
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
