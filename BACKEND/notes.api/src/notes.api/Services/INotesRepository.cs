using notes.api.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notes.api.Services
{
    public interface INotesRepository
    {
        Note GetSingleNote(int id);
        IEnumerable<Note> GetChildren(int parentId);
        int AddChildren(Note note);
        bool DeleteNote(int id);
        bool UpdateNote(Note note);
        bool Save();
    }
}
