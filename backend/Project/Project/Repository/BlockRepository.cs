﻿using Microsoft.EntityFrameworkCore;
using Project.dto;
using Project.Dto;
using Project.Entities;

namespace Project.Repository
{
    public class BlockRepository : IBlockRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public BlockRepository(HcmUeQTTB_DevContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<BlockDto>> GetBlocksByCampusIdAsync(string campusId)
        {
            return await _context.Blocks
                .Where(b => b.CampusId == campusId)
                .OrderBy(b => b.SortOrder)  // Sắp xếp theo SortOrder
                .Select(b => new BlockDto
                {
                    Id = b.Id,
                    BlockName = b.BlockName,
                    CampusId = b.CampusId!,
                    CampusName = b.CampusName,
                    SortOrder = b.SortOrder  // Thêm SortOrder vào DTO
                })
                .ToListAsync();
        }
    }
}