using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Repository;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampusController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly ICampusRepository _repo;

        public CampusController(HcmUeQTTB_DevContext context, ICampusRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/Campus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CampusDto>>> GetCampus()
        {
            var campuses = from c in _context.Campuses
                           select new
                           {
                               c.Id,
                               c.CampusName,
                               c.SortOrder
                           };

            var sortedCampuses = campuses.OrderBy(c => c.SortOrder)
                                          .Select(c => new CampusDto
                                          {
                                              Id = c.Id,
                                              CampusName = c.CampusName
                                          });

            return Ok(await sortedCampuses.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Campus>> GetCampus(string id)
        {
            if (_context.Campuses == null)
            {
                return NotFound();
            }
            var campus = await _context.Campuses.FindAsync(id);

            if (campus == null)
            {
                return NotFound();
            }

            return campus;
        }
    }
}
