using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Project.Entities;
using Project.Interface;
using Project.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50MB
});
builder.Services.AddDbContext<HcmUeQTTB_DevContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("MyConnectionString")));
builder.Services.AddScoped<IFloorRepository, FloorRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IBlockRepository, BlockRepository>();
builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
builder.Services.AddScoped<ICriteriaRepository, CriteriaRepository>();
builder.Services.AddScoped<ICleaningFormRepository, CleaningFormRepository>();
builder.Services.AddScoped<ICleaningReportRepository, CleaningReportRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ITagsPerCriteriaRepository, TagsPerCriteriaRepository>();
builder.Services.AddScoped<ICriteriasPerFormRepository, CriteriasPerFormRepository>();
builder.Services.AddScoped<ICriteriaReportRepository, CriteriaReportRepository>();
builder.Services.AddScoped<IRoomCategoryRepository, RoomCategoryRepository>();
builder.Services.AddScoped<IGroupRoomRepository, GroupRoomRepository>();
builder.Services.AddScoped<IScheduleRepository,ScheduleRepository>();
builder.Services.AddScoped<IUserPerTagRepository, UserPerTagRepository>();
builder.Services.AddScoped<IResponsibleGroupRepository, ResponsibleGroupRepository>();


// Add Static Files Middleware
builder.Services.AddDirectoryBrowser();

var app = builder.Build();

// Enable serving static files from wwwroot/uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.WebRootPath, "uploads")),
    RequestPath = "/uploads"
});


// Enable directory browsing (optional, for debugging purposes)
app.UseDirectoryBrowser(new DirectoryBrowserOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.WebRootPath, "uploads")),
    RequestPath = "/uploads"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
