using Microsoft.Data.SqlClient;
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
                gr.Id,
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
                b.CampusName, gr.GroupName, gr.Description,gr.Id;";

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
                            Id = result["Id"].ToString(),
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

        public async Task<RoomGroupViewDto> GetRoomGroupById(string id)
        {
            // Câu truy vấn SQL để lấy thông tin nhóm và danh sách người dùng liên quan
            var sqlQuery = @"
        SELECT 
     gr.GroupName,
     gr.Id,
	 fl.FloorName,
	 bl.BlockName,
	 bl.CampusName,
	 bl.CampusId,
	 rct.CategoryName,
	 gr.[Description], 
	r.Id AS RoomId,
	r.RoomName

 FROM 
     GroupRoom gr
 LEFT JOIN 
     RoomByGroup rbg ON rbg.GroupRoomId = gr.Id
 LEFT JOIN 
     [Rooms] r ON rbg.RoomId = r.Id
 LEFT JOIN 
     [Blocks] bl ON r.BlockId = bl.Id
 LEFT JOIN 
     [Floors] fl ON r.FloorId = fl.Id
 LEFT JOIN 
     [RoomCategories] rct ON r.RoomCategoryId = rct.Id
 WHERE 
     gr.Id = @Id";

            RoomGroupViewDto roomGroup = null;
            var rooms = new List<RoomViewDto>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = sqlQuery;
                command.Parameters.Add(new SqlParameter("@Id", id)); 
                _context.Database.OpenConnection();

                using (var result = await command.ExecuteReaderAsync())
                {
                    while (await result.ReadAsync())
                    {
                        if (roomGroup == null)
                        {
                            roomGroup = new RoomGroupViewDto
                            {
                                Id = result["id"].ToString(),
                                GroupName = result["GroupName"].ToString(),
                                Description = result["Description"].ToString(),
                                Rooms = new List<RoomViewDto>()
                            };
                        }

                        // Kiểm tra nếu có người dùng liên quan và thêm vào danh sách Users
                        if (!result.IsDBNull(result.GetOrdinal("RoomId")))
                        {
                            var room = new RoomViewDto
                            {
                                Id = result["RoomId"].ToString(),
                                CampusName = result["CampusName"].ToString(),
                                CampusId = result["CampusId"].ToString(),
                                BlockName = result["BlockName"].ToString(),
                                FloorName = result["FloorName"].ToString(),
                                RoomName = result["RoomName"].ToString(),
                                CategoryName = result["CategoryName"].ToString(),
                            };
                            rooms.Add(room);
                        }
                    }
                }
            }

            if (roomGroup != null)
            {
                roomGroup.Rooms = rooms; 
            }

            return roomGroup;
        }
    }




}
