using Project.Entities;

namespace Project.Repository
{
    public interface ICampusRepository
    {
        public Task<List<Campus>> GetAllCampus(string id);
    }
}
