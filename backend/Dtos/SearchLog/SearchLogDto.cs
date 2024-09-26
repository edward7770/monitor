using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.SearchLog
{
    public class SearchLogDto
    {
        public int Id { get; set; }
        public string SearchString { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
    }
}