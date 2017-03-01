using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace notes.api.Models
{
    public class NoteForUpdateDto
    {
        public int ParentId { get; set; }
     
        [MaxLength(20)]
        public string Title { get; set; }

        public string Content { get; set; }
    }
}
