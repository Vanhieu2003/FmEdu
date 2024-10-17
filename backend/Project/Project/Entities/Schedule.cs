using System;
using System.Collections.Generic;

namespace Project.Entities
{
    public partial class Schedule
    {
        public string? Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? RecurrenceRule { get; set; }
        public bool? AllDay { get; set; }
        public string? ResponsibleGroupId { get; set; }
        public int? Index { get; set; }
    }
}
