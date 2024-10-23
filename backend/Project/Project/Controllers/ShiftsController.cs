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
    public class ShiftsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IShiftRepository _repo;

        public ShiftsController(HcmUeQTTB_DevContext context,IShiftRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult> GetShifts(int pageNumber = 1, int pageSize = 10)
        {
            var shifts = from s in _context.Shifts
                         join roomCategory in _context.RoomCategories
                         on s.RoomCategoryId equals roomCategory.Id
                         select new ShiftViewDto
                         {
                             Id = s.Id,
                             ShiftName = s.ShiftName,
                             StartTime = s.StartTime,
                             EndTime = s.EndTime,
                             CategoryName = roomCategory.CategoryName
                         };

            // Đếm tổng số bản ghi
            var totalRecords = await shifts.CountAsync();

            // Lấy dữ liệu phân trang
            var shiftDetails = await shifts
                .OrderByDescending(s => s.ShiftName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Trả về dữ liệu với tổng số bản ghi
            return Ok(new
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Shifts = shiftDetails
            });
        }

        // GET: api/Shifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shift>> GetShift(string id)
        {
          if (_context.Shifts == null)
          {
              return NotFound();
          }
            var shift = await _context.Shifts.FindAsync(id);

            if (shift == null)
            {
                return NotFound();
            }

            return shift;
        }
        [HttpGet("ByRoomId/{RoomId}")]
        public async Task<IActionResult> GetShiftsByRoomId(string RoomId)
        {
            var shifts = await _repo.GetShiftsByRoomId(RoomId);
            if(shifts == null)
            {
                return NotFound();
            }
            return Ok(shifts);
        }
        // PUT: api/Shifts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShift(string id, ShiftDto shifdto)
        {
            if (id != shifdto.Id)
            {
                return BadRequest();
            }

            var shift = new Shift
            {
                Id = shifdto.Id,
                ShiftName = shifdto.ShiftName,
                StartTime = TimeSpan.Parse(shifdto.StartTime),
                EndTime = TimeSpan.Parse(shifdto.EndTime),
                RoomCategoryId = shifdto.RoomCategoryId,
                CreateAt = shifdto.CreateAt,
                UpdateAt = shifdto.UpdateAt
            };
            _context.Entry(shift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftExists(id))
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

        // POST: api/Shifts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Shift>> PostShift(ShiftCreateDto shiftDto)
        {

            TimeSpan startTime;
            TimeSpan endTime;

            if (!TimeSpan.TryParse(shiftDto.StartTime, out startTime))
            {
                return BadRequest(new { success = false, message = "StartTime không hợp lệ." });
            }

            if (!TimeSpan.TryParse(shiftDto.EndTime, out endTime))
            {
                return BadRequest(new { success = false, message = "EndTime không hợp lệ." });
            }

            Console.WriteLine($"Start Time: {startTime}, End Time: {endTime}");


            if (shiftDto.Category == null || !shiftDto.Category.Any())
            {
                return BadRequest(new { success = false, message = "Category không hợp lệ." });
            }


            var overlappingShift = await _context.Shifts
                .Where(s => shiftDto.Category.Contains(s.RoomCategoryId))
                .Where(s => (startTime < s.EndTime && endTime > s.StartTime))
                .FirstOrDefaultAsync();


            if (overlappingShift != null)
            {
                Console.WriteLine($"Conflicting Shift Found: {overlappingShift.ShiftName} - Start: {overlappingShift.StartTime}, End: {overlappingShift.EndTime}");
                return Conflict(new { success = false, message = "Ca làm việc đã tồn tại trong khoảng thời gian này cho khu vực này." });
            }


            var shiftsToCreate = new List<Shift>();

            foreach (var roomCategoryId in shiftDto.Category)
            {
                var shift = new Shift
                {
                    Id = Guid.NewGuid().ToString(),
                    ShiftName = shiftDto.ShiftName,
                    StartTime = startTime,
                    EndTime = endTime,
                    RoomCategoryId = roomCategoryId,
                    CreateAt = DateTime.Now,
                    UpdateAt = DateTime.Now
                };

                shiftsToCreate.Add(shift);
            }

            _context.Shifts.AddRange(shiftsToCreate);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(new { success = false, message = "Có lỗi khi tạo ca." });
            }


            return CreatedAtAction("GetShift", new { id = shiftsToCreate.First().Id }, new { success = true, message = "Tạo ca làm thành công.", shifts = shiftsToCreate });
        }
        // DELETE: api/Shifts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShift(string id)
        {
            if (_context.Shifts == null)
            {
                return NotFound();
            }
            var shift = await _context.Shifts.FindAsync(id);
            if (shift == null)
            {
                return NotFound();
            }

            _context.Shifts.Remove(shift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftExists(string id)
        {
            return (_context.Shifts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
