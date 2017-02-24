using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notes.api.Entities
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options)
        {
          //  Database.Migrate();
            Database.EnsureCreated();
        }

        public DbSet<Note> Notes { get; set; } 
    }
}
