using System;
using System.Collections.Generic;

namespace Project.Entities
{
    public partial class UserGroup
    {
        public string Id { get; set; } = null!;
        public string? GroupUserId { get; set; }
        public string? UserId { get; set; }
    }
}
