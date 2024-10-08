using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.FormData
{
    public class FormRecordX187Dto
    {
        public string IdNumber { get; set; }
        public string CaseNumber { get; set; }
        public string Name { get; set; }
        public string Particulars { get; set; }
        public DateOnly NoticeDate { get; set; }
        public string Description { get; set; }
        public string Spousedetails { get; set; }
        public string Period { get; set; }
        public string ExecutorName { get; set; }
        public string ExecutorPhone { get; set; }
        public string ExecutorEmail { get; set; }
        public string RawRecord { get; set; }
    }
}