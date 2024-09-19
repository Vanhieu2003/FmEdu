using Microsoft.EntityFrameworkCore;
using Project.Entities;

namespace Project.Repository
{
    public class TagRepository : ITagRepository
    {
        private readonly HcmUeQTTB_DevContext _context;
        public TagRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }
        public async Task<List<TagsPerCriteria>> GetTagsPerCriteriaByTag(string tagId)
        {
            var tags = await _context.TagsPerCriteria.Where(t => t.TagId == tagId).ToListAsync();
            return tags;
        }
    }
}
