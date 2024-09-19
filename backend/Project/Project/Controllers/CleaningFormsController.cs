using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Entities;
using Project.Repository;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CleaningFormsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICleaningFormRepository _repo;

        public CleaningFormsController(HcmUeQTTB_DevContext context, ICleaningFormRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/CleaningForms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CleaningForm>>> GetCleaningForms([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1)
            {
                return BadRequest("Số trang không hợp lệ.");
            }

            if (pageSize <= 0)
            {
                return BadRequest("Kích thước trang không hợp lệ.");
            }

            var cleaningForms = await _repo.GetAllCleaningForm(pageNumber, pageSize);


            if (cleaningForms == null || !cleaningForms.Any())
            {
                return NotFound("Không tìm thấy Form.");
            }


            return Ok(cleaningForms);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<CleaningForm>> GetCleaningForm(string id)
        {
            if (_context.CleaningForms == null)
            {
                return NotFound();
            }
            var cleaningForm = await _context.CleaningForms.FindAsync(id);

            if (cleaningForm == null)
            {
                return NotFound();
            }

            return cleaningForm;
        }

        [HttpGet("GetFullInfo/{formId}")]
        public async Task<ActionResult> GetFormDetails(string formId)
        {
            // Tìm form dựa vào formId
            var form = await _context.CleaningForms
                .Where(f => f.Id == formId)
                .FirstOrDefaultAsync();

            if (form == null)
            {
                return NotFound("Form không tồn tại");
            }

            // Tìm thông tin Campus, Block, Floor, Room dựa trên form
            var campus = await _context.Campuses.FirstOrDefaultAsync(c => c.Id == form.CampusId);
            var block = await _context.Blocks.FirstOrDefaultAsync(b => b.Id == form.BlockId);
            var floor = await _context.Floors.FirstOrDefaultAsync(f => f.Id == form.FloorId);
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == form.RoomId);

            // Tìm tất cả các tiêu chí của form từ bảng CriteriasPerForm
            var criteriaPerForm = await _context.CriteriasPerForms
                .Where(cpf => cpf.FormId == formId)
                .ToListAsync();

            // Tạo danh sách các tiêu chí và các tag tương ứng
            var criteriaList = new List<object>();

            foreach (var cpf in criteriaPerForm)
            {
                // Tìm thông tin chi tiết về từng tiêu chí
                var criteria = await _context.Criteria
                    .Where(c => c.Id == cpf.CriteriaId)
                    .FirstOrDefaultAsync();

                if (criteria != null)
                {
                    // Lấy các tagId liên quan đến tiêu chí từ bảng TagsPerCriteria
                    var tagIds = await _context.TagsPerCriteria
                        .Where(tpc => tpc.CriteriaId == criteria.Id)
                        .Select(tpc => tpc.TagId)
                        .ToListAsync();

                    // Lấy các tag tương ứng từ bảng Tag
                    var tags = await _context.Tags
                        .Where(tag => tagIds.Contains(tag.Id))
                        .Select(tag => new
                        {
                            Id = tag.Id,
                            Name = tag.TagName
                        })
                        .ToListAsync();

                    // Thêm tiêu chí vào danh sách
                    criteriaList.Add(new
                    {
                        Id = criteria.Id,
                        Name = criteria.CriteriaName,
                        CriteriaType = criteria.CriteriaType,
                        Tags = tags
                    });
                }
            }

            // Tạo object trả về
            var result = new
            {
                IdForm = form.Id,
                CampusName = campus?.CampusName,
                BlockName = block?.BlockName,
                FloorName = floor?.FloorName,
                RoomName = room?.RoomName,
                CriteriaList = criteriaList
            };

            return Ok(result);
        }


        [HttpGet("criteria/{formId}")]
        public async Task<IActionResult> GetCriteriaByFormId(string formId)
        {
            var criteria = await _repo.GetCriteriaByFormId(formId);
            if (criteria == null)
            {
                return NotFound();
            }
            return Ok(criteria);
        }

        [HttpGet("ByRoomId/{RoomId}")]
        public async Task<IActionResult> GetFormByRoomId(string RoomId)
        {
            var form = await _repo.GetCleaningFormByRoomId(RoomId);
            if (form == null)
            {
                return NotFound();
            }
            return Ok(form);
        }

        // PUT: api/CleaningForms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCleaningForm(string id, CleaningForm cleaningForm)
        {
            if (id != cleaningForm.Id)
            {
                return BadRequest();
            }

            _context.Entry(cleaningForm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CleaningFormExists(id))
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
        public async Task<ActionResult<CleaningForm>> PostCleaningForm(CleaningForm cleaningForm)
        {
            if (_context.CleaningForms == null)
            {
                return Problem("Entity set 'HcmUeQTTB_DevContext.CleaningForms' is null.");
            }

            // Kiểm tra xem roomId đã tồn tại hay chưa
            var existingForm = await _context.CleaningForms
                .FirstOrDefaultAsync(cf => cf.RoomId == cleaningForm.RoomId);

            if (existingForm != null)
            {
                // Nếu roomId đã tồn tại, trả về lỗi Conflict
                return Conflict(new { message = "Room ID already exists in Cleaning Forms." });
            }

            // Nếu không tồn tại, tiếp tục thêm mới
            if (string.IsNullOrEmpty(cleaningForm.Id))
            {
                cleaningForm.Id = Guid.NewGuid().ToString();
            }

            _context.CleaningForms.Add(cleaningForm);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CleaningFormExists(cleaningForm.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("PostCleaningForm", new { id = cleaningForm.Id }, cleaningForm);
        }

        private bool CleaningFormExists(string id)
        {
            return (_context.CleaningForms?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
