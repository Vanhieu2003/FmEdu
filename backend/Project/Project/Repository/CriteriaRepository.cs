using Microsoft.EntityFrameworkCore;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class CriteriaRepository : ICriteriaRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public CriteriaRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }

        public async Task<List<Criteria>> GetAllCriteria(int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Criteria.Where(c => c.Status == "ENABLE").AsQueryable();

            query = query.OrderByDescending(r => r.RoomCategoryId);

            var criteriaDetail = await query
               .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return criteriaDetail;
        }

        public async Task<List<Criteria>> GetCriteriasByRoomId(string id)
        {
            var roomcategoryId = await _context.Rooms.Where(x => x.Id == id).Select(x => x.RoomCategoryId).FirstOrDefaultAsync();
            var criteriaList = await _context.Criteria.Where(x => x.RoomCategoryId == roomcategoryId && x.Status== "ENABLE").ToListAsync();
            return criteriaList;
        }

        public async Task<List<Criteria>> GetCriteriasByRoomsCategoricalId(string id)
        {
            var criteriaList = await _context.Criteria.Where(x => x.RoomCategoryId == id).ToListAsync();
            return criteriaList;
        }
        public async Task<List<Criteria>> SearchCriteria(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return await _context.Criteria.Where(x => x.Status == "ENABLE").ToListAsync();
            }
            return await _context.Criteria
                .Where(c => c.CriteriaName.Contains(keyword) && c.Status == "ENABLE") 
                .ToListAsync();
        }
    }
}
