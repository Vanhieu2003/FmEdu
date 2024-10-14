using System;
using System.Collections.Generic;

namespace Project.Entities
{
    public partial class UserResponsibleTag
    {
        public string Id { get; set; } = null!;
        public string? ReportId { get; set; }
        public string? UserId { get; set; }
        public string? TagId { get; set; }
        public string? UserPerResGroupId { get; set; }
    }
}
