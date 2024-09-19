using Project.Entities;

namespace Project.Repository
{
    public interface ICriteriaReportRepository
    {
        public Task<List<CriteriaReport>> GetReportByCriteriaId(string criteriaId);
    }
}
