using Project.Dto;
using Project.Entities;

namespace Project.Interface
{
    public interface IResponsibleGroupRepository
    {
        public Task<List<ResponsibleGroup>> GetAllResponsiableGroup();
        public Task<ResponsiableGroupDto> GetAllResponsiableGroupById(string Id);
    }
}
