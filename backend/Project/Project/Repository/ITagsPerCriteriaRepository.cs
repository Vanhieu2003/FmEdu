using Project.Entities;

namespace Project.Repository
{
    public interface ITagsPerCriteriaRepository
    {
        public Task<List<Tag>> GetTagsByCriteriaId(string criteriaId);
    }
}
