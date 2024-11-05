using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        private readonly HcmUeQTTB_DevContext _context;
        private readonly IChartRepository _repo;

        public ChartController(HcmUeQTTB_DevContext context, IChartRepository chartRepository)
        {
            _context = context;
            _repo = chartRepository;
        }
        
        
        [HttpGet("GetTopCriteriaValuesByCampus")]
        public async Task<IActionResult> GetTopCriteriaValuesByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetTopCriteriaValuesByCampus(campusId);
            return Ok(result);
        }




      cc

        [HttpGet("GetCleaningReportsByYear")]
        public async Task<IActionResult> GetCleaningReportsByYear()
        {
            var result = await _context.Set<CleaningReportDto>()
                .FromSqlRaw(@"
    WITH MonthsInYear AS (
        SELECT 
            MONTH(DATEADD(MONTH, n, DATEFROMPARTS(YEAR(GETDATE()), 1, 1))) AS MonthNum,
            YEAR(GETDATE()) AS YearNum
        FROM 
            (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11) AS Numbers
    )
    SELECT 
        C.CampusName AS CampusName,
        RIGHT('0' + CAST(M.MonthNum AS VARCHAR(2)), 2) + '-' + CAST(M.YearNum AS VARCHAR(4)) AS ReportTime,  
        COALESCE(AVG(CR.Value), 0) AS AverageValue
    FROM 
        MonthsInYear M
    CROSS JOIN Campus C 
    LEFT JOIN Blocks B ON B.CampusId = C.Id
    LEFT JOIN Rooms R ON R.BlockId = B.Id
    LEFT JOIN CleaningForm CF ON CF.RoomId = R.Id
    LEFT JOIN CleaningReport CR ON CF.Id = CR.FormId 
        AND MONTH(CR.UpdateAt) = M.MonthNum 
        AND YEAR(CR.UpdateAt) = M.YearNum
    GROUP BY 
        C.CampusName, M.YearNum, M.MonthNum
    ORDER BY 
        M.YearNum DESC, M.MonthNum ASC;")
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet("GetCleaningReportsByLast10Days")]
        public async Task<IActionResult> GetCleaningReportsByLast10Day()
        {
            var result = await _context.Set<CleaningReportDto>()
                .FromSqlRaw(@"
     WITH Last10Days AS (
    SELECT CAST(GETDATE() - n AS DATE) AS ReportDate
    FROM (VALUES (0), (1), (2), (3), (4), (5), (6), (7), (8), (9)) AS Numbers(n)
)
SELECT 
    C.CampusName AS CampusName,
     FORMAT(L.ReportDate, 'dd-MM-yyyy') AS ReportTime,  
    COALESCE(AVG(CR.Value), 0) AS AverageValue 
FROM 
    Last10Days L  
CROSS JOIN 
    Campus C  
LEFT JOIN 
    Blocks B ON B.CampusId = C.Id
LEFT JOIN 
    Rooms R ON R.BlockId = B.Id
LEFT JOIN 
    CleaningForm CF ON CF.RoomId = R.Id
LEFT JOIN 
    CleaningReport CR ON CF.Id = CR.FormId 
    AND CAST(CR.UpdateAt AS DATE) = L.ReportDate   
GROUP BY 
    C.CampusName, L.ReportDate 
ORDER BY 
    L.ReportDate ASC;")
                .ToListAsync();

            return Ok(result);
        }




  

 

        //mới làm
        [HttpGet("GetBlockReports")]
        public async Task<IActionResult> GetBlockReports([FromQuery] string campusId, [FromQuery] DateTime? targetDate = null)
        {
            var result = await _repo.GetBlockReportsAsync(campusId, targetDate);
            return Ok(result);
        }



       

        [HttpGet("comparison")]
        public async Task<IActionResult> GetCampusReportComparison(int? year = null)
        {
            var result = await _repo.GetCampusReportComparison(year);
            return Ok(result);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetCleaningReportSummary([FromQuery] string? campusId)
        {
            var result = await _repo.GetCleaningReportSummary(campusId);
            return Ok(result);
        }

        [HttpGet("responsible-tag-report")]
        public async Task<IActionResult> GetResponsibleTagReportByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetResponsibleTagReportByCampus(campusId);
            return Ok(result);
        }

        [HttpGet("room-group-report")]
        public async Task<IActionResult> GetRoomGroupReportByCampus([FromQuery] string? campusId)
        {
            var result = await _repo.GetRoomGroupReportByCampus(campusId);
            return Ok(result);
        }

        [HttpGet("detail-report")]
        public async Task<IActionResult> GetCampusDetailReportById([FromQuery] string? campusId)
        {
            var result = await _repo.GetCampusDetailReportById(campusId);
            return Ok(result);
        }

        [HttpGet("GetShiftEvaluations")]
        public async Task<IActionResult> GetShiftEvaluations([FromQuery] string? campusId = null)
        {
            var evaluations = await _repo.GetShiftEvaluationsAsync(campusId);
            return Ok(evaluations);
        }

    }

}



