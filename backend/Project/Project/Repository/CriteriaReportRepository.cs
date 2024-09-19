using Microsoft.EntityFrameworkCore;
using Project.Entities;

namespace Project.Repository
{
    public class CriteriaReportRepository : ICriteriaReportRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public CriteriaReportRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }

        public async Task<List<CriteriaReport>> GetReportByCriteriaId(string criteriaId)
        {
            return await _context.CriteriaReports
                .Where(cr => cr.CriteriaId == criteriaId)
                .ToListAsync();
        }
    }
}
