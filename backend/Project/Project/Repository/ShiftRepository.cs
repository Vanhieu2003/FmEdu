using Microsoft.EntityFrameworkCore;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class ShiftRepository : IShiftRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public ShiftRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }
        public async Task<List<Shift>> GetShiftsByRoomId(string id)
        {
            var shifts = await _context.Shifts
                .Where(x => x.RoomCategoryId == id && x.Status == "ENABLE")
                .OrderBy(x => x.ShiftName)
                .ToListAsync();

            return shifts;
        }
    }
}
