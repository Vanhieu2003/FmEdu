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

        // GET: api/Shifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shift>>> GetShifts()
        {
          if (_context.Shifts == null)
          {
              return NotFound();
          }
            return await _context.Shifts.ToListAsync();
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
        public async Task<ActionResult<Shift>> PostShift(ShiftDto shifdto)
        {
            if (_context.Shifts == null)
            {
                return Problem("Entity set 'HcmUeQTTB_DevContext.Shifts' is null.");
            }

            
            var shift = new Shift {
                Id = Guid.NewGuid().ToString(),
                ShiftName = shifdto.ShiftName,
                StartTime = TimeSpan.Parse(shifdto.StartTime),
                EndTime = TimeSpan.Parse(shifdto.EndTime),
                RoomCategoryId = shifdto.RoomCategoryId,
                CreateAt = shifdto.CreateAt,
                UpdateAt = shifdto.UpdateAt
            };

            _context.Shifts.Add(shift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ShiftExists(shift.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetShift", new { id = shift.Id }, shift);
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
