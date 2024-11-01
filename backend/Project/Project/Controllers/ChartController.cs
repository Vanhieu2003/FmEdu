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
        [HttpGet("average-values")]
        public async Task<IActionResult> GetAverageValues(string campusId)
        {
            var result = await _context.Set<CampusAverageValueDto>()
        .FromSqlRaw(@"
            SELECT 
                C.CampusName AS CampusName,
                DATEPART(DAY, CR.UpdateAt) AS DAY,
                AVG(CR.Value) AS AverageValue
            FROM 
                CleaningReport CR
            JOIN 
                CleaningForm CF ON CR.FormId = CF.Id
            JOIN 
                Rooms R ON CF.RoomId = R.Id
            JOIN 
                Blocks B ON R.BlockId = B.Id
            JOIN 
                Campus C ON B.CampusId = C.Id
            WHERE 
                C.Id = {0}
            GROUP BY 
                C.CampusName,
                DATEPART(DAY, CR.UpdateAt)
            ORDER BY 
                C.CampusName,
                DAY;", campusId)
        .ToListAsync();

            return Ok(result);
        }
        [HttpGet("GetTopCriteriaValuesByCampus")]
        public async Task<IActionResult> GetTopCriteriaValuesByCampus([FromQuery] string? campusId = null)
        {
            var query = _context.Set<CriteriaValueDto>()
                .FromSqlRaw(@"
     SELECT TOP 5 
         ca.CampusName,
         cr.CriteriaName,
         CEILING(
             CASE 
                 WHEN cr.CriteriaType = 'RATING' THEN 
                     (SUM(crr.Value) / (COUNT(crr.Value) * 5.0)) * 100 
                 WHEN cr.CriteriaType = 'BINARY' THEN 
                     (SUM(crr.Value) / (COUNT(crr.Value) * 2.0)) * 100
                 ELSE 0
             END) AS Value
     FROM 
         CleaningForm cf
         JOIN CriteriaReport crr ON cf.Id = crr.FormId
         JOIN Criteria cr ON crr.CriteriaId = cr.Id
         JOIN Rooms r ON cf.RoomId = r.Id
         JOIN Blocks b ON r.BlockId = b.Id
         JOIN Campus ca ON b.CampusId = ca.Id
     " + (string.IsNullOrEmpty(campusId) ? "" : "WHERE ca.Id = {0}") + @"
     GROUP BY 
         ca.CampusName, 
         cr.CriteriaName, 
         cr.CriteriaType
     ORDER BY 
         Value DESC;",
                    campusId);

            var result = await query.ToListAsync();

            return Ok(result);
        }

        [HttpGet("GetCleaningReportCount")]
        public async Task<IActionResult> GetCleaningReportCount()
        {
            // Thực hiện truy vấn SQL và ánh xạ vào DTO
            var result = await _context.Set<CleaningReportCountDto>()
                .FromSqlRaw(@"
            SELECT 
                COUNT(CASE WHEN CAST(UpdateAt AS DATE) = CAST(GETDATE() AS DATE) THEN 1 END) AS TotalCount,
                COUNT(CASE WHEN CAST(UpdateAt AS DATE) = CAST(GETDATE() - 1 AS DATE) THEN 1 END) AS TotalCountYesterday,
                COUNT(*) AS TotalReports,
                COUNT(CASE WHEN CAST(UpdateAt AS DATE) = CAST(GETDATE() AS DATE) THEN 1 END) - 
                COUNT(CASE WHEN CAST(UpdateAt AS DATE) = CAST(GETDATE() - 1 AS DATE) THEN 1 END) AS Change
            FROM 
                CleaningReport
        ")
                .ToListAsync();

            // Kiểm tra xem có kết quả hay không
            if (result == null || !result.Any())
            {
                return NotFound("No reports found.");
            }

            // Lấy giá trị từ kết quả truy vấn
            var cleaningReportCount = result.First();

            return Ok(cleaningReportCount);
        }

        [HttpGet("GetReportInADay")]
        public async Task<IActionResult> GetReportInADay()
        {
            // Thực hiện truy vấn SQL và ánh xạ vào DTO
            var result = await _context.Set<ReportInADayValueDto>()
                .FromSqlRaw(@"
           SELECT 
    (SELECT COUNT(*) 
     FROM CleaningForm 
     ) AS TotalRooms,

    -- Đếm số report đã đánh giá trong ngày hôm nay
    (SELECT COUNT(DISTINCT FormId) 
     FROM CleaningReport 
     WHERE CAST(UpdateAt AS DATE) = CAST(GETDATE() AS DATE)) AS TotalReports;
        ")
                .ToListAsync();

            // Kiểm tra xem có kết quả hay không
            if (result == null || !result.Any())
            {
                return NotFound("No reports found.");
            }

            // Lấy giá trị từ kết quả truy vấn
            var cleaningReportCount = result.First();

            return Ok(cleaningReportCount);
        }




        [HttpGet("GetCleaningReportsByQuarter")]
        public async Task<IActionResult> GetCleaningReportsByQuarter()
        {
            var result = await _context.Set<CleaningReportDto>()
                .FromSqlRaw(@"
       WITH Last4Quarters AS (
    SELECT DATEADD(QUARTER, -3, GETDATE()) AS StartDate, GETDATE() AS EndDate
),
Quarters AS (
    SELECT 
        DATEPART(QUARTER, DATEADD(QUARTER, -n, EndDate)) AS QuarterNum,
        DATEPART(YEAR, DATEADD(QUARTER, -n, EndDate)) AS YearNum
    FROM Last4Quarters, 
         (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS Numbers
)
SELECT 
    C.CampusName,
    CONCAT('Q', Q.QuarterNum, '-', Q.YearNum) AS ReportTime,  -- Định dạng Qn-yyyy
    COALESCE(AVG(CR.Value), 0) AS AverageValue
FROM 
    Quarters Q
CROSS JOIN Campus C  
LEFT JOIN Blocks B ON B.CampusId = C.Id
LEFT JOIN Rooms R ON R.BlockId = B.Id
LEFT JOIN CleaningForm CF ON CF.RoomId = R.Id
LEFT JOIN CleaningReport CR ON CF.Id = CR.FormId 
    AND DATEPART(QUARTER, CR.UpdateAt) = Q.QuarterNum 
    AND YEAR(CR.UpdateAt) = Q.YearNum  
GROUP BY 
    C.CampusName, Q.YearNum, Q.QuarterNum
ORDER BY 
    Q.YearNum DESC, Q.QuarterNum ASC;")
                .ToListAsync();

            return Ok(result);
        }


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




        [HttpGet("GetCleaningReportsBy6Months")]
        public async Task<IActionResult> GetCleaningReportsBy6Month()
        {
            var result = await _context.Set<CleaningReportDto>()
                .FromSqlRaw(@"
 WITH Last6Months AS (
    SELECT DATEADD(MONTH, -5, GETDATE()) AS StartDate, GETDATE() AS EndDate
),
Months AS (
    SELECT 
        DATEPART(MONTH, DATEADD(MONTH, -n, EndDate)) AS MonthNum,
        DATEPART(YEAR, DATEADD(MONTH, -n, EndDate)) AS YearNum
    FROM Last6Months, 
         (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) AS Numbers
)
SELECT 
    C.CampusName AS CampusName,  
    RIGHT('0' + CAST(M.MonthNum AS VARCHAR(2)), 2) + '-' + CAST(M.YearNum AS VARCHAR(4)) AS ReportTime, 
    COALESCE(AVG(CR.Value), 0) AS AverageValue
FROM 
    Months M 
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
    M.YearNum DESC, M.MonthNum DESC;")
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet("GetWeeklyCleaningReportsByMonth")]
        public async Task<IActionResult> GetWeeklyCleaningReportsByMonth(int year, int monthNum)
        {
            var sql = @"
    WITH WeeksInMonth AS (
        SELECT 
            (ROW_NUMBER() OVER (ORDER BY DAY(DATEADD(DAY, n, StartOfMonth)))/7) + 1 AS WeekNum, 
            YEAR(StartOfMonth) AS YearNum,
            MONTH(StartOfMonth) AS MonthNum,
            DATEADD(DAY, n, StartOfMonth) AS WeekStartDate
        FROM (
            SELECT 
                DATEFROMPARTS(@year, @monthNum, 1) AS StartOfMonth, 
                EOMONTH(DATEFROMPARTS(@year, @monthNum, 1)) AS EndOfMonth
        ) AS MonthRange,
        (SELECT TOP 31 ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n 
         FROM master..spt_values) AS Numbers
        WHERE DATEADD(DAY, n, StartOfMonth) <= EndOfMonth
    )
    SELECT 
        C.CampusName AS CampusName,
        CONCAT(N'Tuần ', W.WeekNum, ' - ', RIGHT('0' + CAST(W.MonthNum AS NVARCHAR(2)), 2), '-', W.YearNum) AS ReportTime, 
        COALESCE(AVG(CR.Value), 0) AS AverageValue
    FROM 
        WeeksInMonth W
    CROSS JOIN Campus C
    LEFT JOIN Blocks B ON B.CampusId = C.Id
    LEFT JOIN Rooms R ON R.BlockId = B.Id
    LEFT JOIN CleaningForm CF ON CF.RoomId = R.Id
    LEFT JOIN CleaningReport CR ON CF.Id = CR.FormId 
        AND DATEPART(WEEK, CR.UpdateAt) = DATEPART(WEEK, W.WeekStartDate) 
        AND YEAR(CR.UpdateAt) = W.YearNum 
        AND MONTH(CR.UpdateAt) = W.MonthNum
    GROUP BY 
        C.CampusName, W.YearNum, W.MonthNum, W.WeekNum
    ORDER BY 
        W.YearNum DESC, W.MonthNum ASC, W.WeekNum ASC";

            var parameters = new[]
            {

        new SqlParameter("@year", year),
        new SqlParameter("@monthNum", monthNum)
    };

            var result = await _context.Set<CleaningReportDto>()
                .FromSqlRaw(sql, parameters)
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet("GetBlockReports")]
        public async Task<IActionResult> GetBlockReports(string campusId, DateTime? targetDate = null)
        {
            DateTime dateToUse = targetDate ?? DateTime.Today; // Nếu không có ngày truyền vào, sử dụng ngày hiện tại

            var sql = @"
        SELECT  
            B.BlockName,
            COUNT(R.Id) AS TotalRooms, 
            COUNT(DISTINCT CASE 
                WHEN CR.UpdateAt = @date AND CR.Value IS NOT NULL 
                THEN R.Id END) AS TotalEvaluatedRooms, 
            ROUND(COALESCE(AVG(CR.Value), 0), 2) AS AverageCompletionValue,  
            CAST(ROUND(CASE 
                WHEN COUNT(R.Id) = 0 THEN 0
                ELSE COUNT(DISTINCT CASE 
                    WHEN CR.UpdateAt = @date AND CR.Value IS NOT NULL 
                    THEN R.Id END) * 100.0 / COUNT(R.Id) 
            END, 0) AS INT) AS CompletionPercentage  
        FROM 
            Blocks B
        INNER JOIN 
            Rooms R ON B.Id = R.BlockId
        LEFT JOIN 
            CleaningForm F ON R.Id = F.RoomId
        LEFT JOIN 
            CleaningReport CR ON F.Id = CR.FormId 
            AND CR.UpdateAt = @date 
        WHERE 
            B.CampusId = @campusId
        GROUP BY 
            B.Id, B.BlockName
        ORDER BY 
            CompletionPercentage DESC;";

            var parameters = new[]
            {
            new SqlParameter("@campusId", campusId),
            new SqlParameter("@date", dateToUse)
        };

            var result = await _context.Set<BlockReportDto>()
                .FromSqlRaw(sql, parameters)
                .ToListAsync();

            return Ok(result);
        }
        [HttpGet("average-score/{tagId}")]
        public async Task<ActionResult<IEnumerable<UserScoreDto>>> GetAverageScoreByTag(string tagId)
        {
            var scores = new List<UserScoreDto>();

            var query = @"
        SELECT 
            u.Id AS UserId,
            u.UserName,
            AVG(CAST(us.score AS FLOAT)) AS AverageScore  
        FROM 
            [HcmUeQTTB_Dev].[dbo].[UserScore] us
        JOIN 
            [HcmUeQTTB_Dev].[dbo].[User] u ON us.userId = u.Id
        WHERE 
            us.tagId = @tagId
        GROUP BY 
            u.Id, u.UserName;";

            using (var connection = _context.Database.GetDbConnection())
            {
                await connection.OpenAsync();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    command.Parameters.Add(new SqlParameter("@tagId", tagId));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var score = new UserScoreDto
                            {
                                UserId = reader["UserId"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                AverageScore = reader["AverageScore"] != DBNull.Value
                                    ? Math.Ceiling(Convert.ToDouble(reader["AverageScore"])) // Làm tròn lên
                                    : 0 // Gán 0 nếu là DBNull
                            };
                            scores.Add(score);
                        }
                    }
                }
            }

            if (!scores.Any())
            {
                return NotFound(); // Trả về NotFound nếu không có kết quả
            }

            return Ok(scores); // Trả về kết quả
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

    }

}



