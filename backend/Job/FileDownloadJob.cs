using Quartz;
using System.Threading.Tasks;

public class FileDownloadJob : IJob
{
    private readonly SharePointFileDownloaderService _fileDownloaderService;

    // Constructor injection
    public FileDownloadJob(SharePointFileDownloaderService fileDownloaderService)
    {
        _fileDownloaderService = fileDownloaderService;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        // Call your method to download files
        await _fileDownloaderService.DownloadFilesAsync("Schedule", null);
    }
}
