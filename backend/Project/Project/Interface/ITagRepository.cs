using Project.Entities;

namespace Project.Interface
{
    public interface ITagRepository
    {
        public Task<List<TagsPerCriteria>> GetTagsPerCriteriaByTag(string tagId);
    }
}
