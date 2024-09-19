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
    public class CriteriasPerFormsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICriteriasPerFormRepository _repo;

        public CriteriasPerFormsController(HcmUeQTTB_DevContext context, ICriteriasPerFormRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/CriteriasPerForms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CriteriasPerForm>>> GetCriteriasPerForms()
        {
          if (_context.CriteriasPerForms == null)
          {
              return NotFound();
          }
            return await _context.CriteriasPerForms.ToListAsync();
        }


        // GET: api/CriteriasPerForms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CriteriasPerForm>> GetCriteriasPerForm(string id)
        {
          if (_context.CriteriasPerForms == null)
          {
              return NotFound();
          }
            var criteriasPerForm = await _context.CriteriasPerForms.FindAsync(id);

            if (criteriasPerForm == null)
            {
                return NotFound();
            }

            return criteriasPerForm;
        }

        [HttpGet("ByFormId/{formId}")]
        public async Task<IActionResult> GetCriteriaByFormId(string formId)
        {
            var criteria = await _repo.GetCriteriaByFormId(formId);

            if (criteria == null || !criteria.Any())
            {
                return NotFound();
            }

            return Ok(criteria);
        }


        // PUT: api/CriteriasPerForms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCriteriasPerForm(string id, CriteriasPerForm criteriasPerForm)
        {
            if (id != criteriasPerForm.Id)
            {
                return BadRequest();
            }

            _context.Entry(criteriasPerForm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CriteriasPerFormExists(id))
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

        [HttpPut("edit")]
        public async Task<ActionResult> EditForm([FromBody] EditFormDto formData)
        {
            // Tìm form hiện tại
            var existingForm = await _context.CleaningForms.FindAsync(formData.FormId);
            if (existingForm == null)
            {
                return NotFound("Form not found.");
            }

            // Cập nhật thông tin cơ bản của Form
            existingForm.CampusId = formData.CampusId;
            existingForm.BlockId = formData.BlockId;
            existingForm.FloorId = formData.FloorId;
            existingForm.RoomId = formData.RoomId;
            existingForm.UpdateAt = DateTime.Now;

            // Xóa các CriteriaPerForm cũ liên quan đến formId
            var oldCriteria = _context.CriteriasPerForms.Where(cpf => cpf.FormId == formData.FormId);
            _context.CriteriasPerForms.RemoveRange(oldCriteria);

            // Thêm lại các CriteriaPerForm mới
            foreach (var criteria in formData.CriteriaList)
            {
                var newCriteriaPerForm = new CriteriasPerForm
                {
                    Id = Guid.NewGuid().ToString(),
                    FormId = formData.FormId,
                    CriteriaId = criteria.Id,
                    CreateAt = DateTime.Now,
                    UpdateAt = DateTime.Now
                };
                _context.CriteriasPerForms.Add(newCriteriaPerForm);
            }

            await _context.SaveChangesAsync();
            return Ok("Form updated successfully.");
        }

        // POST: api/CriteriasPerForms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CriteriasPerForm>> PostCriteriasPerForm(CriteriasPerForm criteriasPerForm)
        {
          if (_context.CriteriasPerForms == null)
          {
              return Problem("Entity set 'HcmUeQTTB_DevContext.CriteriasPerForms'  is null.");
          }
            if (string.IsNullOrEmpty(criteriasPerForm.Id))
            {
                criteriasPerForm.Id = Guid.NewGuid().ToString();
            }

            _context.CriteriasPerForms.Add(criteriasPerForm);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CriteriasPerFormExists(criteriasPerForm.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCriteriasPerForm", new { id = criteriasPerForm.Id }, criteriasPerForm);
        }
        [HttpPost("newForm")]
        public async Task<ActionResult> AddTagsForCriteria([FromBody] CriteriaPerFormDto newForm)
        {
            foreach (var criteria in newForm.criteriaList)
            {
                var newCriteriaPerForm = new CriteriasPerForm
                {
                    Id = Guid.NewGuid().ToString(),
                    FormId = newForm.formId,
                    CriteriaId = criteria.Id,
                    CreateAt = DateTime.Now,
                    UpdateAt = DateTime.Now
                };
                _context.CriteriasPerForms.Add(newCriteriaPerForm);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/CriteriasPerForms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCriteriasPerForm(string id)
        {
            if (_context.CriteriasPerForms == null)
            {
                return NotFound();
            }
            var criteriasPerForm = await _context.CriteriasPerForms.FindAsync(id);
            if (criteriasPerForm == null)
            {
                return NotFound();
            }

            _context.CriteriasPerForms.Remove(criteriasPerForm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CriteriasPerFormExists(string id)
        {
            return (_context.CriteriasPerForms?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
