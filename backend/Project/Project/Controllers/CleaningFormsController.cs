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
        public async Task<ActionResult<IEnumerable<object>>> GetCleaningForms(
     [FromQuery] int pageNumber = 1,
     [FromQuery] int pageSize = 10)
        {
            // Truy vấn với sắp xếp theo SortOrder của Campus
            var result = await (from cf in _context.CleaningForms
                                join r in _context.Rooms on cf.RoomId equals r.Id
                                join f in _context.Floors on r.FloorId equals f.Id
                                join b in _context.Blocks on r.BlockId equals b.Id
                                join c in _context.Campuses on b.CampusId equals c.Id
                                orderby c.SortOrder // Sắp xếp theo SortOrder của Campus
                                select new
                                {
                                    id = cf.Id,
                                    formName = cf.FormName,
                                    CampusName = c.CampusName,
                                    BlockName = b.BlockName,
                                    FloorName = f.FloorName,
                                    RoomName = r.RoomName
                                })
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

            // Tính tổng số bản ghi
            var totalValue = await _context.CleaningForms.CountAsync();

            // Trả về kết quả và tổng số bản ghi
            var response = new { result, totalValue };
            return Ok(response);
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
            var form = await _context.CleaningForms.FirstOrDefaultAsync(f => f.Id == formId);

            if (form == null)
            {
                return NotFound("Form không tồn tại");
            }

            if (form == null)
            {
                return NotFound("Form không tồn tại");
            }

            // Tìm thông tin Room dựa trên RoomId trong form
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == form.RoomId);
            if (room == null)
            {
                return NotFound("Phòng không tồn tại");
            }

            // Tìm BlockId từ Room và sau đó lấy Block, Campus và Floor
            var block = await _context.Blocks.FirstOrDefaultAsync(b => b.Id == room.BlockId);
            if (block == null)
            {
                return NotFound("Block không tồn tại");
            }

            var campus = await _context.Campuses.FirstOrDefaultAsync(c => c.Id == block.CampusId);
            if (campus == null)
            {
                return NotFound("Campus không tồn tại");
            }

            var floor = await _context.Floors.FirstOrDefaultAsync(f => f.Id == room.FloorId);
            if (floor == null)
            {
                return NotFound("Tầng không tồn tại");
            }

            // Tìm tất cả các tiêu chí của form từ bảng CriteriasPerForm
            var criteriaPerForm = await _context.CriteriasPerForms
                .Where(cpf => cpf.FormId == formId)
                .ToListAsync();

            // Tạo danh sách các tiêu chí và các tag tương ứng
            var criteriaList = new List<object>();
            foreach (var cpf in criteriaPerForm)
            {
                // Tìm thông tin chi tiết về từng tiêu chí
                var criteria = await _context.Criteria.FirstOrDefaultAsync(c => c.Id == cpf.CriteriaId);

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
        [HttpPost("create-form")]
        public async Task<IActionResult> CreateCleaningForms([FromBody] CreateCleaningFormRequest request)
        {
            try
            {
                // Bắt đầu transaction để đảm bảo tất cả thao tác thực hiện thành công hoặc rollback khi có lỗi
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Lặp qua từng RoomId
                foreach (var room in request.RoomId)
                {
                    // Bước 1: Tạo mới CleaningForm cho mỗi RoomId
                    var cleaningForm = new CleaningForm
                    {
                        Id = Guid.NewGuid().ToString(),
                        FormName = request.FormName,
                        RoomId = room.Id, // Mỗi RoomId sẽ tạo 1 CleaningForm
                        CreateAt = DateTime.UtcNow,
                        UpdateAt = DateTime.UtcNow,
                    };

                    await _context.CleaningForms.AddAsync(cleaningForm);
                    await _context.SaveChangesAsync(); // Lưu CleaningForm để lấy FormId

                    // Bước 2: Thêm các Criteria từ danh sách criteriaList vào CriteriaPerForm
                    foreach (var criteria in request.CriteriaList)
                    {
                        var criteriaPerForm = new CriteriasPerForm
                        {
                            Id = Guid.NewGuid().ToString(),
                            FormId = cleaningForm.Id, // FormId mới tạo
                            CriteriaId = criteria.Id,
                            CreateAt = DateTime.UtcNow,
                            UpdateAt = DateTime.UtcNow
                        };

                        await _context.CriteriasPerForms.AddAsync(criteriaPerForm);
                    }

                    // Lưu CriteriaPerForm vào database
                    await _context.SaveChangesAsync();
                }

                // Commit transaction sau khi hoàn thành
                await transaction.CommitAsync();

                return Ok(new { Message = "Tạo thành công các form", TotalFormsCreated = request.RoomId.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }

    private bool CleaningFormExists(string id)
        {
            return (_context.CleaningForms?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
