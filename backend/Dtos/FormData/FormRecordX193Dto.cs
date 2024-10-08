using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.FormData
{
    public class FormRecordX193Dto
    {
        public string IdNumber { get; set; }
        public string CaseNumber { get; set; }
        public string Name { get; set; }
        public string Particulars { get; set; }
        public DateOnly NoticeDate { get; set; }
        public string RawRecord { get; set; }
    }
}