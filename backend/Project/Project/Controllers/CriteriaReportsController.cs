using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Repository;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CriteriaReportsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICriteriaReportRepository _repo;
        public CriteriaReportsController(HcmUeQTTB_DevContext context, ICriteriaReportRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/CriteriaReports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CriteriaReport>>> GetCriteriaReports()
        {
          if (_context.CriteriaReports == null)
          {
              return NotFound();
          }
            return await _context.CriteriaReports.ToListAsync();
        }

        // GET: api/CriteriaReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CriteriaReport>> GetCriteriaReport(string id)
        {
          if (_context.CriteriaReports == null)
          {
              return NotFound();
          }
            var criteriaReport = await _context.CriteriaReports.FindAsync(id);

            if (criteriaReport == null)
            {
                return NotFound();
            }

            return criteriaReport;
        }

        [HttpGet("Criteria/{criteriaId}")]
        public async Task<IActionResult> GetReportByCriteriaId(string criteriaId)
        {
            var reports = await _repo.GetReportByCriteriaId(criteriaId);

            if (reports == null)
            {
                return NotFound();
            }

            return Ok(reports);
        }

        // PUT: api/CriteriaReports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCriteriaReport(string id, CriteriaReport criteriaReport)
        {
            if (id != criteriaReport.Id)
            {
                return BadRequest();
            }

            _context.Entry(criteriaReport).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CriteriaReportExists(id))
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

        

        [HttpPost]
        public async Task<ActionResult<CriteriaReport>> PostCriteriaReport(CriteriaReport criteriaReport)
        {
            if (_context.CriteriaReports == null)
            {
                return Problem("Entity set 'HcmUeQTTB_DevContext.CriteriaReports' is null.");
            }

            // Kiểm tra trùng lặp dựa trên CriteriaId, ReportId, và FormId
            var existingReport = await _context.CriteriaReports
                .FirstOrDefaultAsync(cr => cr.CriteriaId == criteriaReport.CriteriaId
                                        && cr.ReportId == criteriaReport.ReportId
                                        && cr.FormId == criteriaReport.FormId);

            if (existingReport != null)
            {
                return Conflict(new { message = "CriteriaReport with the same CriteriaId, ReportId, and FormId already exists." });
            }

            // Nếu không có trùng lặp, tiếp tục thêm mới
            if (string.IsNullOrEmpty(criteriaReport.Id))
            {
                criteriaReport.Id = Guid.NewGuid().ToString();
            }

            criteriaReport.CreateAt = DateTime.UtcNow; // Set thời gian tạo
            _context.CriteriaReports.Add(criteriaReport);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CriteriaReportExists(criteriaReport.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCriteriaReport", new { id = criteriaReport.Id }, criteriaReport);
        }

        [HttpPost("submit-report")]
        
        //public async Task<IActionResult> PostReport([FromBody] ReportDto report)
        //{
        //    if (report == null)
        //    {
        //        return BadRequest("Report data is null.");
        //    }

        //    // Lưu từng criteria vào bảng tương ứng
        //    foreach (var criteria in report.CriteriaList)
        //    {
        //        var criteriaPerForm = new CriteriaReport
        //        {
        //            Id = Guid.NewGuid().ToString(),
        //            ReportId = report.ReportId,
        //            CriteriaId = criteria.CriteriaId,
        //            FormId = report.FormId,
        //            Value = criteria.Value,
        //            Note = criteria.Note,
        //            CreateAt = criteria.CreateAt,
        //            UpdateAt = criteria.UpdateAt
        //        };

        //        _context.CriteriaReports.Add(criteriaPerForm);
        //    }

        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Report submitted successfully." });
        //}

        [HttpPost("calculate-average/{reportId}")]
        public async Task<IActionResult> CalculateAverage(string reportId)
        {
            var criteriaReports = await _context.CriteriaReports
                .Where(cr => cr.ReportId == reportId)
                .ToListAsync();

            if (!criteriaReports.Any())
            {
                return NotFound("Không có tiêu chí nào cho reportId này.");
            }

            // Tính tổng(1) của tất cả các giá trị tiêu chí
            var totalValue = criteriaReports.Sum(cr => Convert.ToInt32(cr.Value));

            // Lấy danh sách criteriaId
            var criteriaIds = criteriaReports.Select(cr => cr.CriteriaId).ToList();

            var criteriaTypes = _context.Criteria
            .Where(c => criteriaIds.Contains(c.Id))
            .Select(c => c.CriteriaType)
            .ToList();

            int totalWeight = criteriaTypes.Sum(type =>
            type == "BINARY" ? 2 :
            type == "RATING" ? 5 : 0);
            var finalValue = (double)totalValue / totalWeight * 100;
            finalValue = Math.Round(finalValue, 2);
            return Ok(new { reportId = reportId, finalValue = finalValue });
        }

        // DELETE: api/CriteriaReports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCriteriaReport(string id)
        {
            if (_context.CriteriaReports == null)
            {
                return NotFound();
            }
            var criteriaReport = await _context.CriteriaReports.FindAsync(id);
            if (criteriaReport == null)
            {
                return NotFound();
            }

            _context.CriteriaReports.Remove(criteriaReport);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CriteriaReportExists(string id)
        {
            return (_context.CriteriaReports?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
