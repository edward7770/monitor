using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Prospect
{
    public class ProspectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ContactName { get; set; }
        public string OfficeNumber { get; set; }
        public string MobileNumber { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
        public DateTime StatusDate { get; set; }
        public DateTime DateCreated { get; set; }
        public List<ProspectNoteDto> Notes { get; set; }
    }
}