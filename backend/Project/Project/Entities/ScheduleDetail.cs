using System;
using System.Collections.Generic;

namespace Project.Entities
{
    public partial class ScheduleDetail
    {
        public string Id { get; set; } = null!;
        public string? ScheduleId { get; set; }
        public string? RoomId { get; set; }
<<<<<<< HEAD
        public string? UserPerResGroupId { get; set; }
=======
        public string? UserGroupId { get; set; }
>>>>>>> 579bf9acca3f6a300a1bc360abbe23a530fbe752
        public string? RoomType { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
}
