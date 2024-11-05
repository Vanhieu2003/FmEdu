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
using Project.Interface;
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
            var totalValue = await _context.Criteria.CountAsync(c => c.Status == "ENABLE");

            if (criterias == null || !criterias.Any())
            {
                return NotFound("Không tìm thấy tiêu chí.");
            }
            var response = new { criterias, totalValue };
            return Ok(response);
        }
        [HttpGet("GetAll")]
        public async Task<ActionResult<Criteria>> GetAllCriteria()
        {
            if (_context.Criteria == null)
            {
                return NotFound();
            }
            var criteria = await _context.Criteria.Where(c => c.Status == "ENABLE").ToListAsync();

            if (criteria == null)
            {
                return NotFound();
            }

            return Ok(criteria);
        }

        // GET: api/Criteria/5
        [HttpGet("id")]
        public async Task<ActionResult<Criteria>> GetCriteria([FromQuery] string id)
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

        [HttpGet("ByRoom")]
        public async Task<IActionResult> GetCriteriasByRoomCategoricalId([FromQuery] string RoomCategoricalId)
        {
            var criteriaList = await _repo.GetCriteriasByRoomsCategoricalId(RoomCategoricalId);
            if (criteriaList == null)
            {
                return NotFound();
            }
            return Ok(criteriaList);
        }
        [HttpGet("ByRoomId")]
        public async Task<IActionResult> GetCriteriasByRoomId([FromQuery] string RoomId)
        {
            var criteriaList = await _repo.GetCriteriasByRoomId(RoomId);
            if (criteriaList == null)
            {
                return NotFound();
            }
            return Ok(criteriaList);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCriteria([FromQuery] string keyword)
        {
            // Execute search using repository
            var criteria = await _repo.SearchCriteria(keyword);
            return Ok(criteria);
        }




        // PUT: api/Criteria/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> DisableCriteria([FromQuery] string id)
        {
            // Kiểm tra nếu _context.Criteria null
            if (_context.Criteria == null)
            {
                return NotFound("Criteria table is not available.");
            }

            // Tìm kiếm criteria theo id
            var criteria = await _context.Criteria.FindAsync(id);
            if (criteria == null)
            {
                return NotFound($"Criteria with ID '{id}' not found.");
            }

            // Cập nhật cột Status thành "DISABLE"
            criteria.Status = "DISABLE";

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.Criteria.Update(criteria);
            await _context.SaveChangesAsync();

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
                .FirstOrDefaultAsync(c => c.CriteriaName == criteriaDto.CriteriaName && c.Status == "ENABLE");

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
                UpdateAt = DateTime.UtcNow,
                Status = "ENABLE"
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
        [HttpDelete]
        public async Task<IActionResult> DeleteCriteria([FromQuery] string id)
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
