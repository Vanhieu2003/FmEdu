using Project.Dto;

namespace Project.Interface
{
    public interface IResponsibleGroupRepository
    {
        public Task<List<ResponsiableGroupViewDto>> GetAllResponsiableGroup();
        public Task<ResponsiableGroupDto> GetAllResponsiableGroupById(string Id);
    }
}
