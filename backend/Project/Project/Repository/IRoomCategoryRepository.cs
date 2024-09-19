using Project.Entities;

namespace Project.Repository
{
    public interface IRoomCategoryRepository
    {
        public Task<List<RoomCategory>> GetRoomCategoriesbyCriteriaId(string criteriaId);
    }
}
