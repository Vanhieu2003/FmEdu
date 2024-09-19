using Project.Entities;

namespace Project.Repository
{
    public interface ICriteriasPerFormRepository
    {
        public Task<List<Criteria>> GetCriteriaByFormId(string formId);
    }
}
