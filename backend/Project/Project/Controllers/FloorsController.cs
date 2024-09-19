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
    public class FloorsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IFloorRepository _repo;

        public FloorsController(HcmUeQTTB_DevContext context, IFloorRepository repo)
        {
            _context = context;
            _repo = repo;
        }


        [HttpGet("Block/{BlockId}")]
        public async Task<IActionResult> GetFloorByBlockId(string BlockId)
        {
            var floor = await _repo.GetFloorByBlockId(BlockId);
            if (floor == null)
            {
                return NotFound();
            }
            return Ok(floor);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Floor>> GetFloor(string id)
        {
            if (_context.Floors == null)
            {
                return NotFound();
            }
            var floor = await _context.Floors.FindAsync(id);

            if (floor == null)
            {
                return NotFound();
            }

            return floor;
        }

    }
}
