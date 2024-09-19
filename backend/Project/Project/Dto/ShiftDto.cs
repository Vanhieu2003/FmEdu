namespace Project.Dto
{
    public class ShiftDto
    {
        public string? Id { get; set; }
        public string ShiftName { get; set; } = null!;
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        public string? RoomCategoryId { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
}
