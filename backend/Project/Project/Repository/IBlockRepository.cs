using Project.dto;
using Project.Dto;
using Project.Entities;
namespace Project.Repository
{
    public interface IBlockRepository
    {
        public Task<IEnumerable<BlockDto>> GetBlocksByCampusIdAsync(string campusId);
    }
}
