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
    public class BlocksController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IBlockRepository _repo;

        public BlocksController(HcmUeQTTB_DevContext context, IBlockRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        [HttpGet("ByCampus/{campusId}")]
        public async Task<IActionResult> GetBlocksByCampusId(string campusId)
        {
            var blocks = await _repo.GetBlocksByCampusIdAsync(campusId);
            if (blocks == null || !blocks.Any())
            {
                return NotFound();
            }
            return Ok(blocks);
        }

        // GET: api/Blocks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Block>> GetBlock(string id)
        {
            if (_context.Blocks == null)
            {
                return NotFound();
            }
            var block = await _context.Blocks.FindAsync(id);

            if (block == null)
            {
                return NotFound();
            }

            return block;
        }
    }
}
