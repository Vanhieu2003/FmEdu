﻿using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class ResponsibleGroupRepository : IResponsibleGroupRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public ResponsibleGroupRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }

        public async Task<List<ResponsibleGroup>> GetAllResponsiableGroup()
        {

            var group = await _context.ResponsibleGroups.ToListAsync();
            return group;
        }

        public async Task<ResponsiableGroupDto> GetAllResponsiableGroupById(string id)
        {
            // Câu truy vấn SQL để lấy thông tin nhóm và danh sách người dùng liên quan
            var sqlQuery = @"
        SELECT 
            rg.GroupName,
            rg.Id,
            rg.Description,
            rg.Color,
            u.Id AS UserId,
            u.FirstName,
            u.LastName,
            u.UserName,
            u.Email
        FROM 
            ResponsibleGroup rg
        LEFT JOIN 
            UserPerResGroup ubrg ON ubrg.ResponsiableGroupId = rg.Id
        LEFT JOIN 
            [User] u ON ubrg.UserId = u.Id
        WHERE 
            rg.Id = @Id";

            ResponsiableGroupDto responsibleGroup = null;
            var users = new List<UserDto>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = sqlQuery;
                command.Parameters.Add(new SqlParameter("@Id", id)); // Thêm tham số Id
                _context.Database.OpenConnection();

                using (var result = await command.ExecuteReaderAsync())
                {
                    while (await result.ReadAsync())
                    {
                        if (responsibleGroup == null)
                        {
                            responsibleGroup = new ResponsiableGroupDto
                            {
                                Id = result["id"].ToString(),
                                GroupName = result["GroupName"].ToString(),
                                Description = result["Description"].ToString(),
                                Color = result["Color"].ToString(),
                                Users = new List<UserDto>()
                            };
                        }

                        // Kiểm tra nếu có người dùng liên quan và thêm vào danh sách Users
                        if (!result.IsDBNull(result.GetOrdinal("UserId")))
                        {
                            var user = new UserDto
                            {
                                Id = result["UserId"].ToString(),
                                FirstName = result["FirstName"].ToString(),
                                LastName = result["LastName"].ToString(),
                                UserName = result["UserName"].ToString(),
                                Email = result["Email"].ToString()
                            };
                            users.Add(user);
                        }
                    }
                }
            }

            if (responsibleGroup != null)
            {
                responsibleGroup.Users = users; // Gán danh sách người dùng vào nhóm chịu trách nhiệm
            }

            return responsibleGroup;
        }

        public async Task<List<ResponsiableGroupViewDto>> GetAll()
        {

            // Câu truy vấn SQL thuần túy
            var sqlQuery = @"
SELECT 
    rg.GroupName,
    COALESCE(rg.Description, 'Không có mô tả') AS Description,
    rg.Id,
    COUNT(u.Id) AS NumberOfUser,
    rg.Color
FROM 
    ResponsibleGroup rg
LEFT JOIN 
    UserPerResGroup ubrg ON rg.Id = ubrg.ResponsiableGroupId
LEFT JOIN 
    [User] u ON ubrg.UserId = u.Id
GROUP BY 
    rg.GroupName, rg.Description, rg.Color, rg.Id
";
            // Thực hiện truy vấn SQL
            var responsiableGroups = new List<ResponsiableGroupViewDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = sqlQuery;
                _context.Database.OpenConnection();
                using (var result = await command.ExecuteReaderAsync())
                {
                    while (await result.ReadAsync())
                    {
                        var responsiableGroup = new ResponsiableGroupViewDto
                        {
                            Color = result["Color"].ToString(),
                            Id = result["id"].ToString(),
                            GroupName = result["GroupName"].ToString(),
                            Description = result["Description"].ToString(),
                            NumberOfUser = (int)result["NumberOfUser"]
                        };
                        responsiableGroups.Add(responsiableGroup);
                    }
                }
            }
            return responsiableGroups;

        }
    }
}