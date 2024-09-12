using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.FormData
{
    // Generic class for paginated results
    public class PagedResult<T>
    {
        // Total number of records matching the query (useful for pagination)
        public int TotalRecords { get; set; }

        // The data for the current page (of type T, can be string, object, etc.)
        public List<T> Data { get; set; }

        // Constructor
        public PagedResult()
        {
            Data = new List<T>();
        }
    }
}
