using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;
using System.Data.Entity;

namespace Project.Repository
{
    public class GroupRoomRepository:IGroupRoomRepository
    {

        private readonly HcmUeQTTB_DevContext _context;

        public GroupRoomRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }

        public async Task<List<GroupWithRoomsViewDto>> GetAllGroupWithRooms()
        {
            // Câu truy vấn SQL thuần túy
            var sqlQuery = @"
            SELECT 
                b.CampusName,
                gr.GroupName,
                gr.Description,
                COUNT(r.Id) AS NumberOfRoom
            FROM 
                RoomByGroup gwr
            JOIN 
                Rooms r ON gwr.RoomId = r.Id
            JOIN 
                Blocks b ON r.BlockId = b.Id
            JOIN 
                GroupRoom gr ON gwr.GroupRoomId = gr.Id
            GROUP BY 
                b.CampusName, gr.GroupName, gr.Description;";

            // Thực hiện truy vấn SQL
            var groupWithRooms = new List<GroupWithRoomsViewDto>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = sqlQuery;
                _context.Database.OpenConnection();

                using (var result = await command.ExecuteReaderAsync())
                {
                    while (await result.ReadAsync())
                    {
                        var groupWithRoom = new GroupWithRoomsViewDto
                        {
                            CampusName = result["CampusName"].ToString(),
                            GroupName = result["GroupName"].ToString(),
                            Description = result["Description"].ToString(),
                            NumberOfRoom = (int)result["NumberOfRoom"]
                        };
                        groupWithRooms.Add(groupWithRoom);
                    }
                }
            }

            return groupWithRooms;
        }
    }




}
