﻿using System;
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
    public class RoomCategoriesController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IRoomCategoryRepository _repo;

        public RoomCategoriesController(HcmUeQTTB_DevContext context, IRoomCategoryRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/RoomCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomCategory>>> GetRoomCategories()
        {
          if (_context.RoomCategories == null)
          {
              return NotFound();
          }
            return await _context.RoomCategories.ToListAsync();
        }

        // GET: api/RoomCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomCategory>> GetRoomCategory(string id)
        {
          if (_context.RoomCategories == null)
          {
              return NotFound();
          }
            var roomCategory = await _context.RoomCategories.FindAsync(id);

            if (roomCategory == null)
            {
                return NotFound();
            }

            return roomCategory;
        }

        [HttpGet("criteria/{criteriaId}")]
        public async Task<ActionResult<RoomCategory>> GetRoomCategoriesbyCriteriaId(string criteriaId)
        {
            var roomCategory = await _repo.GetRoomCategoriesbyCriteriaId(criteriaId);

            if (roomCategory == null)
            {
                return NotFound();
            }

            return Ok(roomCategory);
        }

        // PUT: api/RoomCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomCategory(string id, RoomCategory roomCategory)
        {
            if (id != roomCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(roomCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomCategoryExists(id))
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

        // POST: api/RoomCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RoomCategory>> PostRoomCategory(RoomCategory roomCategory)
        {
          if (_context.RoomCategories == null)
          {
              return Problem("Entity set 'HcmUeQTTB_DevContext.RoomCategories'  is null.");
          }
            _context.RoomCategories.Add(roomCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RoomCategoryExists(roomCategory.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRoomCategory", new { id = roomCategory.Id }, roomCategory);
        }

        // DELETE: api/RoomCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomCategory(string id)
        {
            if (_context.RoomCategories == null)
            {
                return NotFound();
            }
            var roomCategory = await _context.RoomCategories.FindAsync(id);
            if (roomCategory == null)
            {
                return NotFound();
            }

            _context.RoomCategories.Remove(roomCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomCategoryExists(string id)
        {
            return (_context.RoomCategories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}