using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class DownloadHistory
    {
        public int Id { get; set; }
        public int FilesCount { get; set; }
        public string ByAction { get; set; }
        [ForeignKey("AppUser")]
        public string UserId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime StartTime { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndTime { get; set; }
        public virtual AppUser AppUser { get; set; }
        public ICollection<DownloadFile> DownloadFiles { get; set; }
    }
}