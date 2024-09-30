using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using Project.Dto;
using Project.Entities;
using Project.Interface;

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
                                       join r in _context.Rooms on cf.RoomId equals r.Id
                                       join b in _context.Blocks on r.BlockId equals b.Id
                                       join c in _context.Campuses on b.CampusId equals c.Id
                                       join f in _context.Floors on r.FloorId equals f.Id
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
                                     join r in _context.Rooms on cf.RoomId equals r.Id
                                     join b in _context.Blocks on r.BlockId equals b.Id
                                     join c in _context.Campuses on b.CampusId equals c.Id
                                     join f in _context.Floors on r.FloorId equals f.Id
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

            // Sắp xếp báo cáo theo thời gian tạo mới nhất
            reportDetailsQuery = reportDetailsQuery.OrderByDescending(r => r.createAt);

            // Phân trang và lấy kết quả
            var reportDetails = await reportDetailsQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return reportDetails;
        }

    }
}
