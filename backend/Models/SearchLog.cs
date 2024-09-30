using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SearchLog
    {
        public int Id { get; set; }
        public string SearchString { get; set; }
        [ForeignKey("AppUser")]
        public string UserId { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}