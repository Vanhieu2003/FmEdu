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

        public ShiftsController(HcmUeQTTB_DevContext context, IShiftRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult> GetShifts(int pageNumber = 1, int pageSize = 10, string? shiftName = null, string? categoryName = null)
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
                             CategoryName = roomCategory.CategoryName,
                             roomCategoryId = roomCategory.Id,
                             Status = s.Status,
                         };


            if (!string.IsNullOrEmpty(shiftName))
            {
                shifts = shifts.Where(s => s.ShiftName.Contains(shiftName));
            }


            if (!string.IsNullOrEmpty(categoryName))
            {
                shifts = shifts.Where(s => s.CategoryName.Contains(categoryName));
            }


            var totalRecords = await shifts.CountAsync();

            var shiftDetails = await shifts
                .OrderByDescending(s => s.ShiftName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();


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
            if (shifts == null)
            {
                return NotFound();
            }
            return Ok(shifts);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutShift(string id, ShiftUpdateDto shiftDto)
        {
            var shift = await _context.Shifts.FindAsync(id);
            if (shift == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy ca làm việc." });
            }

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


            var duplicateShiftName = await _context.Shifts
                .Where(s => s.RoomCategoryId == shift.RoomCategoryId && s.ShiftName == shiftDto.ShiftName && s.Id != id)
                .FirstOrDefaultAsync();

            if (duplicateShiftName != null)
            {
                return Conflict(new { success = false, message = "Tên ca đã tồn tại trong khu vực này." });
            }


            var overlappingShift = await _context.Shifts
                .Where(s => s.RoomCategoryId == shift.RoomCategoryId && s.Id != id)
                .Where(s => startTime < s.EndTime && endTime > s.StartTime)
                .FirstOrDefaultAsync();

            if (overlappingShift != null)
            {
                return Conflict(new { success = false, message = "Ca làm việc đã tồn tại trong khoảng thời gian này cho khu vực này." });
            }


            shift.ShiftName = shiftDto.ShiftName;
            shift.StartTime = startTime;
            shift.EndTime = endTime;
            shift.UpdateAt = DateTime.Now;


            shift.Status = !string.IsNullOrEmpty(shiftDto.Status) ? shiftDto.Status : "ENABLE";

            _context.Entry(shift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftExists(id))
                {
                    return NotFound(new { success = false, message = "Không tìm thấy ca làm việc." });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { success = true, message = "Cập nhật ca làm thành công.", shift });
        }








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

            if (shiftDto.Category == null || !shiftDto.Category.Any())
            {
                return BadRequest(new { success = false, message = "Category không hợp lệ." });
            }


            var duplicateShiftName = await _context.Shifts
                .Where(s => shiftDto.Category.Contains(s.RoomCategoryId))
                .Where(s => s.ShiftName == shiftDto.ShiftName)
                .FirstOrDefaultAsync();

            if (duplicateShiftName != null)
            {
                return Conflict(new { success = false, message = "Tên ca đã tồn tại trong khu vực này." });
            }


            var overlappingShift = await _context.Shifts
                .Where(s => shiftDto.Category.Contains(s.RoomCategoryId))
                .Where(s => startTime < s.EndTime && endTime > s.StartTime)
                .FirstOrDefaultAsync();

            if (overlappingShift != null)
            {
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
                    Status = "ENABLE",
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
