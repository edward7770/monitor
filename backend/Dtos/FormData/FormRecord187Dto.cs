using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.FormData
{
    public class FormRecord187Dto
    {
        [MaxLength(1000)]
        public string RawRecord { get; set; }
        public string IdNumber { get; set; }
        public DateTime? NoticeDate { get; set; }
    }
}