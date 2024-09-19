using Project.Entities;

namespace Project.Dto
{
    public class CriteriaDto
    {
        public string? CriteriaId { get; set; }
        public List<Tag> Tag { get; set; } = null!;
    }
    public class CreateCriteriaDto
    {
        public string CriteriaName { get; set; } = null!;
        public string RoomCategoryId { get; set; } = null!;
        public string CriteriaType { get; set; } = null!;
        public List<string> Tags { get; set; } = new List<string>();
    }
}
