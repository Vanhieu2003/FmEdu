using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
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
    public class CriteriaController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICriteriaRepository _repo;

        public CriteriaController(HcmUeQTTB_DevContext context, ICriteriaRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/Criteria
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Criteria>>> GetCriteria([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {


            if (pageNumber < 1)
            {
                return BadRequest("Số trang không hợp lệ.");
            }

            if (pageSize <= 0)
            {
                return BadRequest("Kích thước trang không hợp lệ.");
            }

            var criterias = await _repo.GetAllCriteria(pageNumber, pageSize);


            if (criterias == null || !criterias.Any())
            {
                return NotFound("Không tìm thấy tiêu chí.");
            }


            return Ok(criterias);
        }


        // GET: api/Criteria/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Criteria>> GetCriteria(string id)
        {
            if (_context.Criteria == null)
            {
                return NotFound();
            }
            var criteria = await _context.Criteria.FindAsync(id);

            if (criteria == null)
            {
                return NotFound();
            }

            return criteria;
        }
        [HttpGet("ByRoom/{RoomCategoricalId}")]
        public async Task<IActionResult> GetCriteriasByRoomCategoricalId(string RoomCategoricalId)
        {
            var criteriaList = await _repo.GetCriteriasByRoomsCategoricalId(RoomCategoricalId);
            if (criteriaList == null)
            {
                return NotFound();
            }
            return Ok(criteriaList);
        }
        [HttpGet("ByRoomId/{RoomId}")]
        public async Task<IActionResult> GetCriteriasByRoomId(string RoomId)
        {
            var criteriaList = await _repo.GetCriteriasByRoomId(RoomId);
            if (criteriaList == null)
            {
                return NotFound();
            }
            return Ok(criteriaList);
        }
        [HttpGet("getCriteriaByRoom/{roomId}")]
        public async Task<IActionResult> GetCriteriaByRoom(string roomId)
        {
            // Bước 1: Tìm tất cả các Form liên quan đến RoomId
            var formId = await _context.CleaningForms
                .Where(cf => cf.RoomId == roomId)
                .Select(cf => cf.Id)
                .FirstOrDefaultAsync();

            if (!formId.Any())
            {
                return NotFound("No forms found for the given room.");
            }

            // Bước 2: Tìm tất cả các Criteria liên quan đến các Form từ bước 1
            var criteriaIds = await _context.CriteriasPerForms
                .Where(cpf => formId == cpf.FormId)
                .Select(cpf => cpf.CriteriaId)
                .Distinct()
                .ToListAsync();

            if (!criteriaIds.Any())
            {
                return NotFound("No criteria found for the given room.");
            }

            // Bước 3: Lấy thông tin chi tiết về các Criteria từ bảng Criteria
            var criteriaList = await _context.Criteria
                .Where(c => criteriaIds.Contains(c.Id))
                .ToListAsync();

            return Ok(criteriaList);
        }
        // PUT: api/Criteria/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCriteria(string id, Criteria criteria)
        {
            if (id != criteria.Id)
            {
                return BadRequest();
            }

            _context.Entry(criteria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CriteriaExists(id))
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

        // POST: api/Criteria
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // POST: api/Criteria
        [HttpPost("CreateCriteria")]
        public async Task<IActionResult> CreateCriteria([FromBody] CreateCriteriaDto criteriaDto)
        {
            // Kiểm tra CriteriaName có trùng lặp không
            var existingCriteria = await _context.Criteria
                .FirstOrDefaultAsync(c => c.CriteriaName == criteriaDto.CriteriaName);

            if (existingCriteria != null)
            {
                return BadRequest($"CriteriaName '{criteriaDto.CriteriaName}' đã tồn tại.");
            }

            // Tạo mới Criteria
            var newCriteria = new Criteria
            {
                Id = Guid.NewGuid().ToString(),
                CriteriaName = criteriaDto.CriteriaName,
                RoomCategoryId = criteriaDto.RoomCategoryId,
                CriteriaType = criteriaDto.CriteriaType,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            };

            _context.Criteria.Add(newCriteria);
            await _context.SaveChangesAsync();

            // Xử lý tags
            foreach (var tagName in criteriaDto.Tags)
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
                if (tag == null)
                {
                    // Nếu tag chưa tồn tại, tạo mới tag
                    tag = new Tag
                    {
                        Id = Guid.NewGuid().ToString(),
                        TagName = tagName,
                        CreateAt = DateTime.UtcNow,
                        UpdateAt = DateTime.UtcNow
                    };
                    _context.Tags.Add(tag);
                    await _context.SaveChangesAsync();
                }

                // Lưu vào bảng TagsPerCriteria
                var tagsPerCriteria = new TagsPerCriteria
                {
                    Id = Guid.NewGuid().ToString(),
                    TagId = tag.Id,
                    CriteriaId = newCriteria.Id,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow
                };
                _context.TagsPerCriteria.Add(tagsPerCriteria);
            }

            await _context.SaveChangesAsync();

            return Ok(newCriteria);
        }


        // DELETE: api/Criteria/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCriteria(string id)
        {
            if (_context.Criteria == null)
            {
                return NotFound();
            }
            var criteria = await _context.Criteria.FindAsync(id);
            if (criteria == null)
            {
                return NotFound();
            }

            _context.Criteria.Remove(criteria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CriteriaExists(string id)
        {
            return (_context.Criteria?.Any(e => e.Id == id)).GetValueOrDefault();
        }

    }
}
