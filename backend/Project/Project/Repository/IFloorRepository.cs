using Project.Dto;
using Project.Entities;

namespace Project.Repository
{
    public interface IFloorRepository
    {
        public Task<List<FloorDto>> GetFloorByBlockId(string id);
    }
}
