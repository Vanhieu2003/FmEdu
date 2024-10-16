using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

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


        public async Task<IEnumerable<TagGroupDto>> GetTagGroupsWithUserCountAsync()
        {
            var query = @"
            SELECT t.Id, t.TagName, COUNT(upt.UserId) AS NumberOfUsers
            FROM Tag t
            LEFT JOIN UserPerTag upt ON t.Id = upt.TagId
            GROUP BY t.Id, t.TagName;
        ";

            // Sử dụng raw SQL để thực thi truy vấn
            var result = await _context.TagGroupDtos
                .FromSqlRaw(query)
                .ToListAsync();

            return result;
        }

        public async Task<List<ResponsibleTagDto>> GetGroupInfoByTagId(string tagId)
        {
            var result = await _context.Set<ResponsibleTagDto>()
               .FromSqlRaw(@"
           SELECT 
               u.UserName,
               u.FirstName,
               u.LastName,
               u.Email,
               t.TagName,
              ISNULL(rg.GroupName, 'Không có nhóm phòng') AS GroupName
           FROM 
               UserPerTag upt
           LEFT JOIN 
               [User] u ON upt.UserId = u.Id
           LEFT JOIN 
               [Tag] t ON upt.TagId = t.Id
           LEFT JOIN 
               UserPerResGroup uprg ON u.Id = uprg.UserId
           LEFT JOIN 
               ResponsibleGroup rg ON uprg.ResponsiableGroupId = rg.Id
           WHERE 
               upt.TagId = {0}", tagId)
               .ToListAsync();

            return result;
        }

        public async Task<List<TagAverageRatingDto>> GetTagAverageRatingsAsync()
        {
            // Lấy danh sách các tag và các tiêu chí liên quan
            var tagRatings = await (from tag in _context.Tags
                                    join tagCriteria in _context.TagsPerCriteria on tag.Id equals tagCriteria.TagId
                                    join criteriaReport in _context.CriteriaReports on tagCriteria.CriteriaId equals criteriaReport.CriteriaId
                                    join criteria in _context.Criteria on tagCriteria.CriteriaId equals criteria.Id
                                    where criteriaReport.Value.HasValue // Chỉ lấy các giá trị không null
                                    group new { criteriaReport, criteria } by new { tag.TagName } into g
                                    select new
                                    {
                                        TagName = g.Key.TagName,
                                        TotalMaxValue = g.Sum(x => x.criteria.CriteriaType == "BINARY" ? 2 : 5),
                                        TotalValue = g.Sum(x => x.criteriaReport.Value ?? 0)
                                    }).ToListAsync();

            // Tính toán giá trị trung bình cho từng tag
            var tagAverageRatings = tagRatings.Select(tag => new TagAverageRatingDto
            {
                TagName = tag.TagName,
                AverageRating = tag.TotalMaxValue > 0 ? Math.Round((double)tag.TotalValue / tag.TotalMaxValue * 100) : 0
            }).ToList();

            return tagAverageRatings;
        }
    }
}
