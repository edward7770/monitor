using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;
using sharepoint.Dto;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class SharePointFileDownloaderService
{
    private readonly HttpClient _httpClient;
    private readonly string _initialUrl = "https://gpwonline.sharepoint.com/:f:/s/gpw-web/EuUVRm9dXElCjAXBiPdf2xgBAbjuQaq_s8j9c8x7qbVFzg?e=ZCkbyO";
    private readonly string _filesUrl = "https://gpwonline.sharepoint.com/sites/gpw-web/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fgpw%2Dweb%2FShared%20Documents%2FLegal&viewid=7a8fe278%2D931f%2D49d0%2D9374%2Dc8d511d7c610";
    private readonly string _siteUrl = "https://gpwonline.sharepoint.com/";
    private readonly string _apiFilesListUrl = "https://gpwonline.sharepoint.com/sites/gpw-web/_api/web/GetFolderByServerRelativeUrl('Shared%20Documents/Legal')/Files";
    private readonly string _folderPath = "D:\\LegalFiles";
    private readonly string _logFolderPath = "D:\\LegalFiles\\Logs";
    private readonly ApplicationDBContext _context;

    public SharePointFileDownloaderService(HttpClient httpClient, ApplicationDBContext context)
    {
        _context = context;
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    }

    public async Task<CookieContainer> DownloadFilesAsync(string action, string userId = null)
    {
        var handler = new HttpClientHandler
        {
            UseCookies = true,
            CookieContainer = new CookieContainer()
        };

        using (var initialClient = new HttpClient(handler))
        {
            var response = await initialClient.GetAsync(_initialUrl);
            response.EnsureSuccessStatusCode();

            var cookies = handler.CookieContainer.GetCookies(new Uri(_initialUrl));

            var request = new HttpRequestMessage(HttpMethod.Get, _apiFilesListUrl);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            foreach (Cookie cookie in cookies)
            {
                initialClient.DefaultRequestHeaders.Add("Cookie", $"{cookie.Name}={cookie.Value}");
            }

            var listFilesResponse = await initialClient.SendAsync(request);
            listFilesResponse.EnsureSuccessStatusCode();
            var listFilesContent = await listFilesResponse.Content.ReadAsStringAsync();
            var filesJson = JsonConvert.DeserializeObject<SharePointFileListDto>(listFilesContent);

            var files = filesJson.Value;

            var downloadFiles = ReadDownloadedFiles();

            var existingHistory = await _context.DownloadHistories
                .FirstOrDefaultAsync(h => h.EndTime == null && h.ByAction == action && h.UserId == userId);

            if (existingHistory != null)
            {
                Console.WriteLine("An extraction process is already running for this user and action.");
                return null;
            }

            var filesCount = 0;
            var newDownloadHistory = new DownloadHistory {
                FilesCount = 0,
                ByAction = action,
                UserId = userId,
                StartTime = DateTime.Now,
                EndTime = null
            };

            await _context.DownloadHistories.AddAsync(newDownloadHistory);
            await _context.SaveChangesAsync();

            foreach (var file in files)
            {
                var fileName = file.Name.ToString();
                var fileUrl = file.ServerRelativeUrl.ToString();

                if(downloadFiles.Contains(fileName))
                {
                    Console.WriteLine($"File {fileName} has already been downloaded.");
                    continue;
                }

                var fileResponse = await initialClient.GetAsync($"{_siteUrl}{fileUrl}");
                if(fileResponse.IsSuccessStatusCode)
                {
                    var fileBytes = await fileResponse.Content.ReadAsByteArrayAsync();
                    await System.IO.File.WriteAllBytesAsync(Path.Combine(_folderPath, fileName), fileBytes);
                    Console.WriteLine($"File {fileName} downloaded successfully");

                    filesCount++;

                    UpdateDownloadedFiles(fileName);
                }
                else 
                {
                    Console.WriteLine($"Error downloading file {fileName}: {fileResponse.StatusCode}");
                }

                var newDownloadFile = new DownloadFile {
                    HistoryId = newDownloadHistory.Id,
                    FileName = fileName,
                    ProcessTime = DateTime.Now
                };

                await _context.DownloadFiles.AddAsync(newDownloadFile);
            }

            // var downloadHistory = await _context.DownloadHistories.FindAsync(newDownloadHistory.Id);
            
            newDownloadHistory.FilesCount = filesCount;
            newDownloadHistory.EndTime = DateTime.Now;

            _context.DownloadHistories.Update(newDownloadHistory);
            await _context.SaveChangesAsync();
        }

        return null;
    }

    private HashSet<string> ReadDownloadedFiles()
    {
        var filePath = Path.Combine(_logFolderPath, "downloaded_files.txt");

        // Extract only file names from each line and ignore the timestamp
        if (File.Exists(filePath))
        {
            return new HashSet<string>(
                File.ReadLines(filePath)
                    .Select(line => line.Split('|')[0].Trim()) // Keep only the file name part
            );
        }

        return new HashSet<string>();
    }

    private void UpdateDownloadedFiles(string fileName)
    {
        var filePath = Path.Combine(_logFolderPath, "downloaded_files.txt");
        var dateTime = DateTime.Now.ToString("yyyyMMdd HH:mm");

        using (var writer = File.AppendText(filePath))
        {
            writer.WriteLine($"{fileName} | {dateTime}");
        }
    }
}
