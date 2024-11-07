using Project.Dto;
using Project.Entities;

namespace Project.Interface
{
    public interface ITagRepository
    {
        public Task<List<TagsPerCriteria>> GetTagsPerCriteriaByTag(string tagId);
        public Task<List<TagAverageRatingDto>> GetTagAverageRatingsAsync();
        public Task<IEnumerable<TagGroupDto>> GetTagGroupsWithUserCountAsync(int pageNumber = 1, int pageSize = 10);

        public Task<List<ResponsibleTagDto>> GetGroupInfoByTagId(string tagId);
       
    }
}
