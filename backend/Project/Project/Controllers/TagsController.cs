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
    public class TagsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ITagRepository _repo;

        public TagsController(HcmUeQTTB_DevContext context, ITagRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            return await _context.Tags.ToListAsync();
        }

        [HttpGet("GetTagGroups")]
        public async Task<IActionResult> GetTagGroupsWithUserCount()
        {
            var tagGroups = await _repo.GetTagGroupsWithUserCountAsync();
            return Ok(tagGroups);
        }

        [HttpGet("GetGroupInfoByTagId")]
        public async Task<IActionResult> GetGroupInfoByTagId([FromQuery] string tagId)
        {
            var result = await _repo.GetGroupInfoByTagId(tagId);
            return Ok(result);
        }

        // GET: api/Tags
        [HttpGet("GetTag")]
        public async Task<ActionResult<Tag>> GetTag([FromQuery] string id)
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            return tag;
        }

        [HttpGet("tagspercriteria")]
        public async Task<IActionResult> GetCriteriaTagByTag([FromQuery] string tagId)
        {
            var tags = await _repo.GetTagsPerCriteriaByTag(tagId);
            if (tags == null)
            {
                return NotFound();
            }
            return Ok(tags);
        }

        [HttpGet("average-ratings")]
        public async Task<IActionResult> GetTagAverageRatings()
        {
            var result = await _repo.GetTagAverageRatingsAsync();
            return Ok(result);
        }

        // PUT: api/Tags
        [HttpPut("UpdateTag")]
        public async Task<IActionResult> PutTag([FromQuery] string id, [FromBody] Tag tag)
        {
            if (id != tag.Id)
            {
                return BadRequest();
            }

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
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

        // POST: api/Tags
        [HttpPost]
        public async Task<ActionResult<Tag>> PostTag([FromBody] Tag tag)
        {
            if (_context.Tags == null)
            {
                return Problem("Entity set 'HcmUeQTTB_DevContext.Tags' is null.");
            }

            // Kiểm tra trùng lặp dựa trên TagName
            var existingTag = await _context.Tags
                .AnyAsync(t => t.TagName == tag.TagName);

            if (existingTag)
            {
                return Conflict("A Tag with the same TagName already exists.");
            }

            // Tạo ID mới nếu chưa có
            if (string.IsNullOrEmpty(tag.Id))
            {
                tag.Id = Guid.NewGuid().ToString();
            }

            // Thiết lập CreateAt và UpdateAt
            tag.CreateAt = DateTime.UtcNow;
            tag.UpdateAt = DateTime.UtcNow;

            _context.Tags.Add(tag);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TagExists(tag.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTag", new { id = tag.Id }, tag);
        }

        // DELETE: api/Tags
        [HttpDelete("DeleteTag")]
        public async Task<IActionResult> DeleteTag([FromQuery] string id)
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TagExists(string id)
        {
            return (_context.Tags?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
