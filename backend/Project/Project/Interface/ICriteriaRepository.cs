using Project.Entities;

namespace Project.Interface
{
    public interface ICriteriaRepository
    {
        public Task<List<Criteria>> GetCriteriasByRoomsCategoricalId(string id);

        public Task<List<Criteria>> GetAllCriteria(int pageNumber = 1, int pageSize = 10);

        public Task<List<Criteria>> GetCriteriasByRoomId(string id);
        Task<List<Criteria>> SearchCriteria(string keyword);
    }
}
