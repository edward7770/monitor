using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Prospect
{
    public class ProspectNoteDto
    {
        public Guid Id { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
    }
}