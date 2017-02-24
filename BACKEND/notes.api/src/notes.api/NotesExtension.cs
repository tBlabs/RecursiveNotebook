using notes.api.Entities;
using System.Collections.Generic;
using System.Linq;

namespace notes.api
{
    public static class NotesExtension
    {
        public static void EnsureSeedDataForContext(this NotesDbContext context)
        {
            if (context.Notes.Any())
            {
                return;
            }

            var notes = new List<Note>()
            {
                new Note() { ParentId = 0, Title = "Initial tab", Content = "(this is tab content)\n\nRENAME TAB - click twice\nDELETE TAB - right click\nADD NEW - click on (+)" },      
            };

            context.Notes.AddRange(notes);

            context.SaveChanges();      
        }
    }
}
