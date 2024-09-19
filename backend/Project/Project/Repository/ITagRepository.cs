using Project.Entities;

namespace Project.Repository
{
    public interface ITagRepository
    {
        public Task<List<TagsPerCriteria>> GetTagsPerCriteriaByTag(string tagId);
    }
}
