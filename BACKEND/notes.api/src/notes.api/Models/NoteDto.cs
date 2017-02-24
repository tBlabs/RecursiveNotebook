using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notes.api.Models
{
    public class NoteDto
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

       // System.ComponentModel.DataAnnotations.RequiredAttribute
    }
}
