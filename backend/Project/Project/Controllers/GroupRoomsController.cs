using System;
using System.Collections.Generic;
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
    public class GroupRoomsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IGroupRoomRepository _roomRepository;

        public GroupRoomsController(HcmUeQTTB_DevContext context, IGroupRoomRepository groupRoomRepository)
        {
            _context = context;
            _roomRepository = groupRoomRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupWithRoomsViewDto>>> GetGroupRooms()
        {
            try
            {
                var result = await _roomRepository.GetAllGroupWithRooms();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error: " + ex.Message);
            }
        }


        // GET: api/GroupRooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomGroupViewDto>> GetRoomGroupById(string id)
        {
            var result = await _roomRepository.GetRoomGroupById(id);

            if (result == null)
            {
                return NotFound();  // Trả về 404 nếu không tìm thấy nhóm chịu trách nhiệm với Id đó
            }

            return Ok(result);  // Trả về thông tin nhóm chịu trách nhiệm và người dùng
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomGroup(string id, [FromBody] RoomGroupUpdateDto dto)
        {
            try
            {
                // Kiểm tra sự tồn tại của nhóm chịu trách nhiệm
                var group = await _context.GroupRooms.FindAsync(id);
                if (group == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy nhóm phòng với Id này." });
                }

                // Kiểm tra xem tên nhóm đã tồn tại (không phân biệt chữ hoa, chữ thường)
                var existingGroupByName = await _context.GroupRooms
                    .FirstOrDefaultAsync(g => g.GroupName.ToLower() == dto.GroupName.ToLower() && g.Id != id);
                if (existingGroupByName != null)
                {
                    return BadRequest(new { success = false, message = "Tên nhóm đã tồn tại. Vui lòng chọn tên khác." });
                }



                // Cập nhật các trường thông tin
                group.GroupName = dto.GroupName;
                group.Description = dto.Description;
       

                // Xóa tất cả người dùng hiện tại khỏi nhóm
                var existingRoomsInGroup = _context.RoomByGroups.Where(rbg => rbg.GroupRoomId == id);
                _context.RoomByGroups.RemoveRange(existingRoomsInGroup);

                // Thêm danh sách người dùng mới vào nhóm
                foreach (var roomDto in dto.Rooms)
                {
                    var roomByGroup = new RoomByGroup
                    {
                        Id = Guid.NewGuid().ToString(),
                        RoomId = roomDto.Id,
                        GroupRoomId = group.Id
                    };
                    _context.RoomByGroups.Add(roomByGroup);
                }

                // Lưu thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật nhóm phòng thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroupWithRooms([FromBody] GroupWithRoomsDto dto)
        {
            try
            {
                // Kiểm tra xem tên nhóm đã tồn tại chưa
                var existingGroup = await _context.GroupRooms
                    .FirstOrDefaultAsync(g => g.GroupName == dto.GroupName);

                if (existingGroup != null)
                {
                    // Nếu tên nhóm đã tồn tại, trả về lỗi
                    return BadRequest(new { success = false, message = "Tên nhóm đã tồn tại. Vui lòng chọn tên khác." });
                }

                // Tạo nhóm với Id tự động là Guid
                var group = new GroupRoom
                {
                    Id = Guid.NewGuid().ToString(), // Tạo Guid cho RoomGroup
                    GroupName = dto.GroupName,
                    Description = dto.Description
                };

                _context.GroupRooms.Add(group);
                await _context.SaveChangesAsync();

                // Thêm các phòng vào nhóm vừa tạo
                foreach (var roomDto in dto.Rooms)
                {
                    var roomByGroup = new RoomByGroup
                    {
                        Id = Guid.NewGuid().ToString(), // Tạo Guid cho RoomByGroup
                        RoomId = roomDto.Id,
                        GroupRoomId = group.Id // Liên kết GroupRoomId với nhóm vừa tạo
                    };
                    _context.RoomByGroups.Add(roomByGroup);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Nhóm phòng được tạo thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }



        // DELETE: api/GroupRooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroupRoom(string id)
        {
            if (_context.GroupRooms == null)
            {
                return NotFound();
            }
            var groupRoom = await _context.GroupRooms.FindAsync(id);
            if (groupRoom == null)
            {
                return NotFound();
            }

            _context.GroupRooms.Remove(groupRoom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GroupRoomExists(string id)
        {
            return (_context.GroupRooms?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
