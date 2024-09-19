using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using Project.Dto;
using Project.Entities;

namespace Project.Repository
{
    public class CleaningReportRepository : ICleaningReportRepository
    {
        public readonly HcmUeQTTB_DevContext _context;
        public CleaningReportRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }
        public async Task<List<CleaningReport>> GetReportsByShiftId(string shiftId)
        {
            return await _context.CleaningReports
                .Where(cr => cr.ShiftId == shiftId)
                .ToListAsync();
        }
        public async Task<List<CleaningReport>> GetCleaningReportByCleaningForm(string formId)
        {
            var cleaningreport = await _context.CleaningReports.Where(c => c.FormId == formId).ToListAsync();
            return cleaningreport;
        }

        public async Task<CleaningReportDetailsDto> GetInfoByReportId(string reportId)
        {
            var reportDetails = await (from cr in _context.CleaningReports
                                       join cf in _context.CleaningForms on cr.FormId equals cf.Id
                                       join c in _context.Campuses on cf.CampusId equals c.Id
                                       join b in _context.Blocks on cf.BlockId equals b.Id
                                       join f in _context.Floors on cf.FloorId equals f.Id
                                       join r in _context.Rooms on cf.RoomId equals r.Id
                                       where cr.Id == reportId
                                       select new CleaningReportDetailsDto
                                       {
                                           id = cr.Id,
                                           formId = cr.FormId,
                                           campusName = c.CampusName,
                                           blockName = b.BlockName,
                                           floorName = f.FloorName,
                                           roomName = r.RoomName,
                                           value = cr.Value,
                                           userId = cr.UserId,
                                           createAt = cr.CreateAt,
                                           updateAt = cr.UpdateAt
                                       }).FirstOrDefaultAsync();

            return reportDetails;
        }

        public async Task<List<CleaningReportDetailsDto>> GetReportInfo(int pageNumber = 1, int pageSize = 10)
        {
            // Tạo truy vấn lấy thông tin báo cáo
            var reportDetailsQuery = from cr in _context.CleaningReports
                                     join s in _context.Shifts on cr.ShiftId equals s.Id
                                     join cf in _context.CleaningForms on cr.FormId equals cf.Id
                                     join c in _context.Campuses on cf.CampusId equals c.Id
                                     join b in _context.Blocks on cf.BlockId equals b.Id
                                     join f in _context.Floors on cf.FloorId equals f.Id
                                     join r in _context.Rooms on cf.RoomId equals r.Id
                                     select new CleaningReportDetailsDto
                                     {
                                         id = cr.Id,
                                         formId = cr.FormId,
                                         campusName = c.CampusName,
                                         blockName = b.BlockName,
                                         floorName = f.FloorName,
                                         roomName = r.RoomName,
                                         value = cr.Value,
                                         userId = cr.UserId,
                                         startTime = s.StartTime.ToString("hh\\:mm"),
                                         endTime = s.EndTime.ToString("hh\\:mm"),
                                         createAt = cr.CreateAt,
                                         updateAt = cr.UpdateAt
                                     };


            reportDetailsQuery = reportDetailsQuery.OrderByDescending(r => r.createAt);


            var reportDetails = await reportDetailsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return reportDetails;
        }

    }
}
