using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using notes.api.Entities;
using Microsoft.EntityFrameworkCore;
using notes.api.Services;

namespace notes.api
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc();
     
            string connectionString = @"Server=(localdb)\mssqllocaldb;Database=NotesDB;Trusted_Connection=True;";
            services.AddDbContext<NotesDbContext>(o => o.UseSqlServer(connectionString));

            services.AddScoped<INotesRepository, NotesRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, NotesDbContext notesContext)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler();
            }

            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod()
            );

            notesContext.EnsureSeedDataForContext(); // Po skasowaniu bazy należy dokonać updejtu w Package Manageże za pomocą komendy "Update-Database"

            app.UseStatusCodePages();

            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Entities.Note, Models.NoteDto>(); // source --> destination
                cfg.CreateMap<Models.NoteForCreationDto, Entities.Note>();
                cfg.CreateMap<Models.NoteForUpdateDto, Entities.Note>();
                cfg.CreateMap<Entities.Note, Models.NoteForUpdateDto>();
            });
       
            app.UseMvc();
        }
    }
}
