using Project.Entities;

namespace Project.Repository
{
    public interface IShiftRepository
    {
        public Task<List<Shift>> GetShiftsByRoomId(string id);
    }
}
