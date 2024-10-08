using Project.Dto;
using Project.Entities;

namespace Project.Interface
{
    public interface IRoomRepository
    {
        public Task<List<RoomDto>> GetRoomByFloorId(string id);
        public Task<List<RoomDto>> GetRoomByFloorIdIfFormExist(string id);
        public Task<List<Room>> SearchRoom(string roomName);
        public Task<List<RoomDto>> GetRoomsByBlockAndCampusAsync(string blockId, string campusId);
    }
}
