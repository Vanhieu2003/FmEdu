using Microsoft.EntityFrameworkCore;
using Project.Entities;

namespace Project.Repository
{
    public class CampusRepository : ICampusRepository
    {
        private readonly HcmUeQTTB_DevContext _context;
        public CampusRepository(HcmUeQTTB_DevContext context) 
        { 
            _context = context;
        }
        public async Task<List<Campus>> GetAllCampus(string id)
        {
            var campus = await _context.Campuses.Where(c => c.Id == id).ToListAsync();
            return campus;
        }
    }
}
