using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class DownloadFile
    {
        public int Id { get; set; }
        public int HistoryId { get; set; }
        public string FileName { get; set; }
        public DateTime ProcessTime { get; set; }
        [ForeignKey("HistoryId")]
        [JsonIgnore]
        public DownloadHistory DownloadHistory { get; set; }
    }
}