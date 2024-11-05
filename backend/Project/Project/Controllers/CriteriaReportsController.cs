using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;
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
        [HttpGet("id")]
        public async Task<ActionResult<CriteriaReport>> GetCriteriaReport([FromQuery] string id)
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

        [HttpGet("Criteria")]
        public async Task<IActionResult> GetReportByCriteriaId([FromQuery] string criteriaId)
        {
            var reports = await _repo.GetReportByCriteriaId(criteriaId);

            if (reports == null || !reports.Any())
            {
                return NotFound();
            }

            return Ok(reports);
        }


        // PUT: api/CriteriaReports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutCriteriaReport([FromQuery] string id, [FromBody] CriteriaReport criteriaReport)
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
        public async Task<ActionResult<CriteriaReport>> PostCriteriaReport([FromBody] CriteriaReport criteriaReport)
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





        private bool CriteriaReportExists(string id)
        {
            return (_context.CriteriaReports?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
