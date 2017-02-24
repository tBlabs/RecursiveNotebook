using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace notes.api.Entities
{
    public class Note
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Generate on add
        public int Id { get; set; }

        public int ParentId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Title { get; set; }

        public string Content { get; set; }
    }
}
