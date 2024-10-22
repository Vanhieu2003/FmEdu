using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly IScheduleRepository _repo;
        private readonly HcmUeQTTB_DevContext _context;

        public SchedulesController(HcmUeQTTB_DevContext context,IScheduleRepository repo)
        {
            _repo = repo;
            _context = context;
        }

        // GET: api/Schedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleDetailInfoDto>>> GetSchedules()
        {
            var schedules = await _context.Schedules
                .Select(s => new
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    RecurrenceRule = s.RecurrenceRule,
                    AllDay = s.AllDay ?? false,
                    ResponsibleGroupId = s.ResponsibleGroupId,
                    Index = s.Index,
                    StartDate = s.Start,
                    EndDate = s.End,
                    RoomType = _context.ScheduleDetails
                        .Where(sd => sd.ScheduleId == s.Id)
                        .Select(sd => sd.RoomType)
                        .FirstOrDefault(),
                    Users = _context.ScheduleDetails
                        .Where(sd => sd.ScheduleId == s.Id)
                        .Join(_context.Users,
                            sd => sd.UserId,
                            u => u.Id,
                            (sd, u) => new UserDto
                            {
                                Id = u.Id,
                                FirstName = u.FirstName,
                                LastName = u.LastName,
                                UserName = u.UserName,
                                Email = u.Email
                            })
                        .Distinct()
                        .ToList(),
                    ScheduleDetails = _context.ScheduleDetails
                        .Where(sd => sd.ScheduleId == s.Id)
                        .ToList()
                })
                .ToListAsync();

            // Sau khi lấy dữ liệu, xử lý logic switch bên ngoài truy vấn
            var result = schedules.Select(s => new ScheduleDetailInfoDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                RecurrenceRule = s.RecurrenceRule,
                AllDay = s.AllDay,
                ResponsibleGroupId = s.ResponsibleGroupId,
                Index = s.Index ?? 0,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                Users = s.Users,
                Place = s.ScheduleDetails
                    .GroupBy(sd => sd.RoomType)
                    .Select(g => new PlaceDTO
                    {
                        level = g.Key,
                        rooms = g.Key switch
                        {
                            "Cơ sở" => _context.Campuses
                                .Where(c => g.Select(sd => sd.RoomId).Contains(c.Id))
                                .Select(c => new PlaceItemDTO
                                {
                                    Id = c.Id,
                                    Name = c.CampusName
                                })
                                .ToList(),
                            "Tòa nhà" => _context.Blocks
                                .Where(b => g.Select(sd => sd.RoomId).Contains(b.Id))
                                .Select(b => new PlaceItemDTO
                                {
                                    Id = b.Id,
                                    Name = b.BlockName
                                })
                                .ToList(),
                            "Tầng" => _context.Floors
                                .Where(f => g.Select(sd => sd.RoomId).Contains(f.Id))
                                .Select(f => new PlaceItemDTO
                                {
                                    Id = f.Id,
                                    Name = f.FloorName
                                })
                                .ToList(),
                            "Phòng" => _context.Rooms
                                .Where(r => g.Select(sd => sd.RoomId).Contains(r.Id))
                                .Select(r => new PlaceItemDTO
                                {
                                    Id = r.Id,
                                    Name = r.RoomName
                                })
                                .ToList(),
                            _ => new List<PlaceItemDTO>()
                        }
                    })
                    .ToList()
            }).ToList();

            return Ok(result);
        }

        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(string id)
        {
          if (_context.Schedules == null)
          {
              return NotFound();
          }
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }


        [HttpGet("GetUserByShiftAndRoom")]
        public async Task<IActionResult> GetUserByShiftAndRoom(string shiftId, string roomId)
        {
            // Lấy thông tin shift dựa trên shiftId
            var shift = await _context.Shifts.FirstOrDefaultAsync(s => s.Id == shiftId);
            if (shift == null)
            {
                return NotFound("Shift not found");
            }

            // Lấy startTime và endTime từ Shift và chuyển sang kiểu TimeSpan
            var shiftStartTime = shift.StartTime;
            var shiftEndTime = shift.EndTime;

            // Tìm các Schedule có Start và End nằm trong khoảng thời gian của Shift
            var schedules = await _context.Schedules
                .Where(s => s.Start.TimeOfDay >= shiftStartTime && s.End.TimeOfDay <= shiftEndTime)
                .ToListAsync();

            if (schedules.Count == 0)
            {
                return NotFound("No schedules found within the shift time range");
            }

            // Tìm các ScheduleDetail dựa trên ScheduleId và RoomId
            var scheduleIds = schedules.Select(s => s.Id).ToList();
            var scheduleDetails = await _context.ScheduleDetails
                .Where(sd => scheduleIds.Contains(sd.ScheduleId) && sd.RoomId == roomId)
                .ToListAsync();

            if (scheduleDetails.Count == 0)
            {
                return NotFound("No schedule details found for the given room and shift");
            }

            // Lấy danh sách UserId từ ScheduleDetail
            var userIds = scheduleDetails.Select(sd => sd.UserId).Distinct().ToList();

            // Bước 4: Lấy danh sách TagId và UserId từ bảng UserPerTag theo userIds
            var userPerTags = await _context.UserPerTags
                .Where(upt => userIds.Contains(upt.UserId))
                .ToListAsync();

            // Bước 5: Lấy tất cả các TagId trong danh sách userPerTags
            var tagIds = userPerTags.Select(upt => upt.TagId).Distinct().ToList();

            // Bước 6: Lấy tên các Tag dựa trên tagIds
            var tags = await _context.Tags
                .Where(t => tagIds.Contains(t.Id))
                .ToListAsync();

            // Bước 7: Tạo một Dictionary để nhóm các User theo từng Tag
            var result = new List<object>();

            foreach (var tag in tags)
            {
                // Lấy tất cả các userId trong bảng UserPerTag tương ứng với tag.Id
                var usersInTag = userPerTags
                    .Where(upt => upt.TagId == tag.Id)
                    .Select(upt => upt.UserId)
                    .ToList();

                // Lấy thông tin các User dựa trên danh sách userIds trong tag này
                var users = await _context.Users
                    .Where(u => usersInTag.Contains(u.Id))
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email
                    })
                    .ToListAsync();

                // Tạo đối tượng để lưu kết quả, với TagName là key và danh sách User là value
                result.Add(new
                {
                    TagName = tag.TagName,
                    Users = users
                });
            }

            return Ok(result);
        }

        // PUT: api/Schedules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpGet("/GetRoomsList/{RoomType}")]
        public async Task<IActionResult> GetRoomsListByRoomType(string RoomType)
        {
            var rooms = await _repo.GetListRoomByRoomType(RoomType);
            return Ok(rooms);
        }

        [HttpGet]
        [Route("get-users-by-shift-room-and-criteria")]
        public async Task<IActionResult> GetUsersByShiftRoomAndCriteria(
  [FromQuery] string shiftId,
  [FromQuery] string roomId,
  [FromQuery] List<string> criteriaIds)
        {
            // Bước 1: Lấy thời gian startTime và endTime của Shift dựa vào shiftId
            var shift = await _context.Shifts
                .Where(s => s.Id == shiftId)
                .Select(s => new { s.StartTime, s.EndTime })
                .FirstOrDefaultAsync();

            if (shift == null)
            {
                return NotFound("Shift not found.");
            }

            // Bước 2: Lấy danh sách Schedule trong khoảng thời gian của shift
            var schedules = await _context.Schedules
                .Where(s => s.Start.TimeOfDay <= shift.StartTime && s.End.TimeOfDay >= shift.EndTime)
                .Select(s => s.Id)
                .ToListAsync();

            if (schedules.Count == 0)
            {
                return NotFound("No schedules found for the given shift.");
            }

            // Bước 3: Tìm kiếm trong bảng ScheduleDetail các scheduleId và roomId trùng khớp
            var userIds = await _context.ScheduleDetails
                .Where(sd => schedules.Contains(sd.ScheduleId) && sd.RoomId == roomId)
                .Select(sd => sd.UserId)
                .Distinct()
                .ToListAsync();

            if (userIds.Count == 0)
            {
                return NotFound("No users found for the given room in the selected shift.");
            }

            // Bước 4: Lấy danh sách TagId từ bảng TagsPerCriteria dựa trên danh sách criteriaIds
            var tagIdsFromCriteria = await _context.TagsPerCriteria
                .Where(tpc => criteriaIds.Contains(tpc.CriteriaId))
                .Select(tpc => tpc.TagId)
                .Distinct()
                .ToListAsync();

            if (tagIdsFromCriteria.Count == 0)
            {
                return NotFound("No tags found for the given criteria.");
            }

            // Bước 5: Lấy danh sách TagId và UserId từ bảng UserPerTag dựa vào userIds
            var userPerTags = await _context.UserPerTags
                .Where(upt => userIds.Contains(upt.UserId) && tagIdsFromCriteria.Contains(upt.TagId))
                .ToListAsync();

            // Bước 6: Lấy danh sách tất cả các Tag tương ứng với tagIds từ bảng Tags
            var tags = await _context.Tags
                .Where(t => tagIdsFromCriteria.Contains(t.Id))
                .ToListAsync();

            // Bước 7: Tạo một Dictionary để nhóm các User theo từng Tag
            var result = new List<object>();

            foreach (var tag in tags)
            {
                // Lấy tất cả các userId trong bảng UserPerTag tương ứng với tag.Id
                var usersInTag = userPerTags
                    .Where(upt => upt.TagId == tag.Id)
                    .Select(upt => upt.UserId)
                    .ToList();

                // Lấy thông tin các User dựa trên danh sách userIds trong tag này
                var users = await _context.Users
                    .Where(u => usersInTag.Contains(u.Id))
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email
                    })
                    .ToListAsync();

                
                result.Add(new
                {
                    TagName = tag.TagName,
                    Users = users
                });
            }

            // Bước 8: Đối với các TagId mà không có UserId nào, thêm vào một entry với danh sách Users trống
            foreach (var tagId in tagIdsFromCriteria.Except(tags.Select(t => t.Id)))
            {
                var tagName = await _context.Tags
                    .Where(t => t.Id == tagId)
                    .Select(t => t.TagName)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(tagName))
                {
                    result.Add(new
                    {
                        TagName = tagName,
                        Users = new List<object>()
                    });
                }
            }

            return Ok(result);
        }





        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(string id, [FromBody] ScheduleUpdateDto scheduleUpdateDto)
        {
            try
            {
               
                if (scheduleUpdateDto == null)
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });

                
                if (string.IsNullOrEmpty(id))
                    return BadRequest(new { success = false, message = "ID lịch không hợp lệ." });

                
                var existingSchedule = await _context.Schedules.FindAsync(id);
                if (existingSchedule == null)
                    return NotFound(new { success = false, message = "Lịch không tồn tại." });

                
                existingSchedule.Title = scheduleUpdateDto.Title;
                existingSchedule.Start = scheduleUpdateDto.StartDate;
                existingSchedule.End = scheduleUpdateDto.EndDate;
                existingSchedule.AllDay = scheduleUpdateDto.AllDay;
                existingSchedule.RecurrenceRule = scheduleUpdateDto.RecurrenceRule;
                existingSchedule.Description = scheduleUpdateDto.Description;
                existingSchedule.ResponsibleGroupId = scheduleUpdateDto.ResponsibleGroupId;

                
                if (scheduleUpdateDto.Users != null || scheduleUpdateDto.Place != null)
                {
                    var existingDetails = _context.ScheduleDetails.Where(sd => sd.ScheduleId == existingSchedule.Id);
                    _context.ScheduleDetails.RemoveRange(existingDetails); 

                    
                    if (scheduleUpdateDto.Users != null && scheduleUpdateDto.Place != null)
                    {
                        foreach (var userId in scheduleUpdateDto.Users)
                        {
                            foreach (var place in scheduleUpdateDto.Place)
                            {
                                foreach (var room in place.rooms)
                                {
                                    var scheduleDetail = new ScheduleDetail
                                    {
                                        Id = Guid.NewGuid().ToString(),
                                        ScheduleId = existingSchedule.Id,
                                        UserId = userId,
                                        RoomId = room.Id,
                                        RoomType = place.level,
                                    };
                                    _context.ScheduleDetails.Add(scheduleDetail);
                                }
                            }
                        }
                    }
                }

               
                await _context.SaveChangesAsync();

               
                return Ok(new
                {
                    success = true,
                    message = "Cập nhật lịch thành công.",
                    schedule = new
                    {
                        existingSchedule.Id,
                        existingSchedule.Title,
                        existingSchedule.Start,
                        existingSchedule.End,
                        existingSchedule.AllDay,
                        existingSchedule.RecurrenceRule,
                        existingSchedule.Description,
                        existingSchedule.ResponsibleGroupId
                    }
                });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi cập nhật lịch.", error = ex.Message });
            }
        }




        [HttpPost]
        public async Task<IActionResult> CreateSchedule([FromBody] ScheduleCreateDto scheduleCreateDto)
        {
            try
            {
                
                if (scheduleCreateDto == null)
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });

                
                if (string.IsNullOrEmpty(scheduleCreateDto.Title) || scheduleCreateDto.StartDate == null || scheduleCreateDto.EndDate == null)
                    return BadRequest(new { success = false, message = "Tiêu đề, ngày bắt đầu và ngày kết thúc không được để trống." });

                
                var newSchedule = new Schedule
                {
                    Id = Guid.NewGuid().ToString(), 
                    Title = scheduleCreateDto.Title,
                    Start = scheduleCreateDto.StartDate,
                    End = scheduleCreateDto.EndDate,
                    AllDay = scheduleCreateDto.AllDay,
                    RecurrenceRule = scheduleCreateDto.RecurrenceRule,
                    Description = scheduleCreateDto.Description,
                    Index = scheduleCreateDto.Index,
                    ResponsibleGroupId = scheduleCreateDto.ResponsibleGroupId,
                };

                
                _context.Schedules.Add(newSchedule);

                
                if (scheduleCreateDto.Users != null && scheduleCreateDto.Place != null)
                {
                    foreach (var userId in scheduleCreateDto.Users)
                    {
                        foreach (var place in scheduleCreateDto.Place)
                        {
                            foreach (var room in place.rooms)
                            {
                                var scheduleDetail = new ScheduleDetail
                                {
                                    Id = Guid.NewGuid().ToString(),
                                    ScheduleId = newSchedule.Id,
                                    UserId = userId,
                                    RoomId = room.Id,
                                    RoomType = place.level,
                                };
                                _context.ScheduleDetails.Add(scheduleDetail);
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Tạo lịch thành công.",
                    schedule = new
                    {
                        newSchedule.Id,
                        newSchedule.Title,
                        newSchedule.Start,
                        newSchedule.End,
                        newSchedule.AllDay,
                        newSchedule.RecurrenceRule,
                        newSchedule.Description,
                        newSchedule.ResponsibleGroupId
                    }
                });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi tạo lịch.", error = ex.Message });
            }
        }




        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(string id)
        {
            if (_context.Schedules == null)
            {
                return NotFound();
            }
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(string id)
        {
            return (_context.Schedules?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
