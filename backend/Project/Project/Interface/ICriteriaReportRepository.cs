using Project.Entities;

namespace Project.Interface
{
    public interface ICriteriaReportRepository
    {
        public Task<List<CriteriaReport>> GetReportByCriteriaId(string criteriaId);
    }
}
