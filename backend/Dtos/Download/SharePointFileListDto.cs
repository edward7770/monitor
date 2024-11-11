using Newtonsoft.Json;

namespace sharepoint.Dto
{
    public class SharePointFileListDto
    {
        [JsonProperty("value")]
        public List<SharePointFileDto> Value { get; set; }
    }

    public class SharePointFileDto
    {
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("ServerRelativeUrl")]
        public string ServerRelativeUrl { get; set; }

    }
}
