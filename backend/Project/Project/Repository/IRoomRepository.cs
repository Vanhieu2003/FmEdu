using Project.Dto;
using Project.Entities;

namespace Project.Repository
{
    public interface IRoomRepository
    {
        public Task<List<RoomDto>> GetRoomByFloorId(string id);
        public Task<List<RoomDto>> GetRoomByFloorIdIfFormExist(string id);
    }
}
