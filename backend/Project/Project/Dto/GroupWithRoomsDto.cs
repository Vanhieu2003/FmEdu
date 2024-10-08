namespace Project.Dto
{
    public class GroupWithRoomsDto
    {
        public string GroupName { get; set; }
        public string Description { get; set; }
        public List<RoomDto> Rooms { get; set; }
    }


<<<<<<< HEAD
    public class ResponsiableGroupDto
    {

        public string? Id { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public List<UserDto> Users { get; set; }
    }

    public class ResponsibleGroupUpdateDto
    {
        public string? GroupName { get; set; } 
        public string? Description { get; set; }  
        public string? Color { get; set; }  
        public List<UserDto> Users { get; set; }  
    }




=======
>>>>>>> 579bf9acca3f6a300a1bc360abbe23a530fbe752
    public class GroupWithRoomsViewDto
    {
        public string? CampusName { get; set; }
        public string? GroupName { get; set; }
        public string? Description { get; set; }
        public int NumberOfRoom { get; set; }
    }

<<<<<<< HEAD
    public class ResponsiableGroupViewDto
    {
        public string? Id { get; set; }
        public string? GroupName { get; set; }
        public string? Color { get; set; }
        public string? Description { get; set; }
        public int NumberOfUser { get; set; }
    }

=======
>>>>>>> 579bf9acca3f6a300a1bc360abbe23a530fbe752
}
