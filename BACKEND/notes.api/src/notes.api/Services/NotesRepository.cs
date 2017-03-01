using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using notes.api.Entities;

namespace notes.api.Services
{
    public class NotesRepository : INotesRepository
    {
        private NotesDbContext _context;

        public NotesRepository(NotesDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Note> GetChildren(int parentId)
        {         
            var list = _context.Notes.Where(n => n.ParentId == parentId).ToList();

            return list;         
        }

        public int AddChildren(Note note)
        {
            _context.Notes.Add(note);
            Save();

            return note.Id;
        }

        public Note GetSingleNote(int id)
        {
            return _context.Notes.Where(n => n.Id == id).FirstOrDefault();
        }
 

        List<int> itemsToDelete = new List<int>(); // TODO: This should be Note's list

        private List<int> FindChildren(int parentId)
        {
            var rec = _context.Notes.Where(n => n.ParentId == parentId).Select(i => i.Id);
            //var rec = from x in _context.Notes
            //          where x.ParentId == parentId
            //          select x.Id;
            return rec.ToList();
        }

        private void FindAllChildren(int id)
        {
            itemsToDelete.Add(id);

            List<int> children = FindChildren(id);
  
            foreach (int c in children)
            {
                FindAllChildren(c);
            }                          
        }

        public bool DeleteNote(int id)
        {
            itemsToDelete.Clear();

            if (GetSingleNote(id) != null)
            {
                FindAllChildren(id);

                if (itemsToDelete.Count > 0)
                {
                    foreach (int i in itemsToDelete)
                    {
                        var noteToDelete = GetSingleNote(i); 

                        if (noteToDelete != null)
                        {
                            _context.Notes.Remove(noteToDelete);
                        }
                    }

                    return Save();
                }
            }

            return false;
        }

        public bool UpdateNote(Note note)
        {
            throw new NotImplementedException();
        }

        public bool Save()
        {
            if (_context.SaveChanges() >= 0)
            {
                return true;
            }

            return false;
        }
    }
}
