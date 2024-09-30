using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class RoomRepository : IRoomRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public RoomRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }
        public async Task<List<RoomDto>> GetRoomByFloorId(string id)
        {
            var rooms = await _context.Rooms
        .Where(x => x.FloorId == id)
        .OrderBy(x => x.SortOrder) 
        .ToListAsync();

            
            var roomDtos = rooms.Select(room => new RoomDto
            {
                Id = room.Id,
                RoomName = room.RoomName,
                FloorId = room.FloorId,
                BlockId = room.BlockId,
                RoomCategoryId = room.RoomCategoryId
               
            }).ToList();

            return roomDtos;
        }

        public async Task<List<RoomDto>> GetRoomByFloorIdIfFormExist(string id)
        {
            var rooms = await _context.Rooms
        .Where(room => room.FloorId == id)
        .Join(_context.CleaningForms,
              room => room.Id,
              form => form.RoomId,
              (room, form) => room) 
        .OrderBy(room => room.SortOrder) 
        .ToListAsync();

            
            var roomDtos = rooms.Select(room => new RoomDto
            {
                Id = room.Id,
                RoomName = room.RoomName,
                FloorId = room.FloorId,
                BlockId = room.BlockId,
                RoomCategoryId = room.RoomCategoryId
               
            }).ToList();

            return roomDtos;
        }

        public async Task<List<Room>> SearchRoom(string roomName)
        {
            if (string.IsNullOrWhiteSpace(roomName))
            {
                return await _context.Rooms.Take(50).ToListAsync();
            }

            return await _context.Rooms
                .Where(r => r.RoomName.Contains(roomName))
                .ToListAsync();
        }
    }
}
