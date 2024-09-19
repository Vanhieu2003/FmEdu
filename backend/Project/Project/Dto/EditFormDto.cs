using Project.Entities;

namespace Project.Dto
{
    public class EditFormDto
    {
        public string FormId { get; set; }
        public string CampusId { get; set; }
        public string BlockId { get; set; }
        public string FloorId { get; set; }
        public string RoomId { get; set; }
        public List<Criteria> CriteriaList { get; set; }
    }
}
