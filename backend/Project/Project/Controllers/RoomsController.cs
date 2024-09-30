﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Entities;
using Project.Interface;


namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IRoomRepository _repo;

        public RoomsController(HcmUeQTTB_DevContext context, IRoomRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(string id)
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _context.Rooms.Take(50).ToListAsync();
            if(rooms == null)
            {
                return NotFound();
            }
            return Ok(rooms);
        }


        [HttpGet("Floor/{FloorId}")]
        public async Task<IActionResult> GetRoomsByFloorId(string FloorId)
        {
            var rooms = await _repo.GetRoomByFloorId(FloorId);

            if (rooms == null || rooms.Count == 0)
            {
                return NotFound();
            }

            return Ok(rooms);
        }

        [HttpGet("IfExistForm/{FloorId}")]
        public async Task<IActionResult> GetRoomsByFloorIdIfFormExists(string FloorId)
        {
            var rooms = await _repo.GetRoomByFloorIdIfFormExist(FloorId);

            if (rooms == null || rooms.Count == 0)
            {
                return NotFound();
            }

            return Ok(rooms);
        }
        [HttpGet("SearchRoom/{roomName}")] 
        public async Task<IActionResult> SearchRoom (string roomName)
        {
            var rooms = await _repo.SearchRoom(roomName);
            return Ok(rooms);

        }
    }
}
