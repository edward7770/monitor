using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class NoticeFile
    {
        public Guid NoticeFileId { get; set; }
        public string FileName { get; set; }
        public byte[] FileContents { get; set; }
        public DateTime DateCreated { get; set; }
    }
}