namespace Project.Dto
{
    public class GroupWithRoomsDto
    {
        public string GroupName { get; set; }
        public string Description { get; set; }
        public List<RoomDto> Rooms { get; set; }
    }


    public class GroupWithRoomsViewDto
    {
        public string? CampusName { get; set; }
        public string? GroupName { get; set; }
        public string? Description { get; set; }
        public int NumberOfRoom { get; set; }
    }

}
