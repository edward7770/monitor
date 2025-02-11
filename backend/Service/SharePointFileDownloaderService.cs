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
using Newtonsoft.Json.Linq;

public class SharePointFileDownloaderService
{
    private readonly HttpClient _httpClient;
    private readonly string _initialUrl = "https://gpwonline.sharepoint.com/:f:/s/gpw-web/EuUVRm9dXElCjAXBiPdf2xgBAbjuQaq_s8j9c8x7qbVFzg?e=ZCkbyO";
    private readonly string _filesUrl = "https://gpwonline.sharepoint.com/sites/gpw-web/Shared%20Documents/Forms/AllItems.aspx?ga=1&id=%2Fsites%2Fgpw%2Dweb%2FShared%20Documents%2FLegal%2F2021%2D2025&viewid=7a8fe278%2D931f%2D49d0%2D9374%2Dc8d511d7c610";
    private readonly string _siteUrl = "https://gpwonline.sharepoint.com/";
    private readonly string _apiFilesListUrl = "https://gpwonline.sharepoint.com/sites/gpw-web/_api/web/GetFolderByServerRelativeUrl('Shared%20Documents/Legal')/Files";
    private readonly string _folderPath = "D:\\Monitor\\Gazettes\\New";
    private readonly string _logFolderPath = "D:\\Monitor\\Gazettes\\Log";
    private readonly ApplicationDBContext _context;

    public SharePointFileDownloaderService(HttpClient httpClient, ApplicationDBContext context)
    {
        _context = context;
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    }

    public class FolderInfo
    {
        public string Name { get; set; }
        public string Url { get; set; }
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
            // Step 1: Get Authentication Cookies
            var response = await initialClient.GetAsync(_initialUrl);
            response.EnsureSuccessStatusCode();

            // Retrieve the cookies after the request
            var cookies = handler.CookieContainer.GetCookies(new Uri(_initialUrl));
            Console.WriteLine("Cookies retrieved from initial URL:");

            foreach (Cookie cookie in cookies)
            {
                Console.WriteLine($"{cookie.Name}={cookie.Value}");
            }

            // Step 2: Get Folders List
            var folderRequest = new HttpRequestMessage(HttpMethod.Get, _apiFilesListUrl.Replace("Files", "Folders"));
            folderRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Adding cookies to the request
            foreach (Cookie cookie in cookies)
            {
                folderRequest.Headers.Add("Cookie", $"{cookie.Name}={cookie.Value}");
            }

            var folderResponse = await initialClient.SendAsync(folderRequest);
            folderResponse.EnsureSuccessStatusCode();

            var folderContent = await folderResponse.Content.ReadAsStringAsync();

            if (string.IsNullOrWhiteSpace(folderContent) || folderContent.Trim() == "{}")
            {
                Console.WriteLine("Empty or invalid folder JSON response.");
                return null;
            }

            var folderJson = JsonConvert.DeserializeObject<JObject>(folderContent);

            var folders = (folderJson["value"] != null)
                ? folderJson["value"]
                    .Select(f => new FolderInfo
                    {
                        Name = f["Name"].ToString(),
                        Url = f["ServerRelativeUrl"].ToString()
                    })
                    .ToList()
                : new List<FolderInfo>();

            if (!folders.Any())
            {
                Console.WriteLine("No folders found.");
                return null;
            }

            // Select the latest folder
            var latestFolder = folders.OrderByDescending(f => f.Name).First();

            // Step 3: Get Files inside the selected folder
            var apiFolderFilesUrl = $"{_siteUrl}sites/gpw-web/_api/web/GetFolderByServerRelativeUrl('{latestFolder.Url}')/Files";

            var encodedFolderPath = Uri.EscapeDataString(latestFolder.Url);
            var filesRequest = new HttpRequestMessage(HttpMethod.Get, $"{_siteUrl}sites/gpw-web/_api/web/GetFolderByServerRelativePath(decodedurl='{encodedFolderPath}')/Files");
            filesRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Adding cookies to the request for fetching files
            foreach (Cookie cookie in cookies)
            {
                filesRequest.Headers.Add("Cookie", $"{cookie.Name}={cookie.Value}");
            }

            var filesResponse = await initialClient.SendAsync(filesRequest);

            var filesContent = await filesResponse.Content.ReadAsStringAsync();

            if (!filesResponse.Content.Headers.ContentType.MediaType.Contains("application/json"))
            {
                Console.WriteLine("Unexpected content type: " + filesResponse.Content.Headers.ContentType.MediaType);
                return null;
            }

            if (string.IsNullOrWhiteSpace(filesContent) || filesContent.Trim() == "{}")
            {
                Console.WriteLine("Empty or invalid files JSON response.");
                return null;
            }

            var filesJson = JsonConvert.DeserializeObject<SharePointFileListDto>(filesContent);
            var files = filesJson?.Value ?? new List<SharePointFileDto>();

            if (!files.Any())
            {
                Console.WriteLine("No files found in the selected folder.");
                return null;
            }

            var downloadFiles = ReadDownloadedFiles();

            var existingHistory = await _context.DownloadHistories
                .FirstOrDefaultAsync(h => h.EndTime == null && h.ByAction == action && h.UserId == userId);

            if (existingHistory != null)
            {
                Console.WriteLine("An extraction process is already running for this user and action.");
                return null;
            }

            var filesCount = 0;
            var newDownloadHistory = new DownloadHistory
            {
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

                if (downloadFiles.Contains(fileName))
                {
                    Console.WriteLine($"File {fileName} has already been downloaded.");
                    continue;
                }

                var fileRequest = new HttpRequestMessage(HttpMethod.Get, $"{_siteUrl}{fileUrl}");
                // Adding cookies for the file download request
                foreach (Cookie cookie in cookies)
                {
                    fileRequest.Headers.Add("Cookie", $"{cookie.Name}={cookie.Value}");
                }

                var fileResponse = await initialClient.SendAsync(fileRequest);

                if (fileResponse.IsSuccessStatusCode)
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

                var newDownloadFile = new DownloadFile
                {
                    HistoryId = newDownloadHistory.Id,
                    FileName = fileName,
                    ProcessTime = DateTime.Now
                };

                await _context.DownloadFiles.AddAsync(newDownloadFile);
            }

            newDownloadHistory.FilesCount = filesCount;
            newDownloadHistory.EndTime = DateTime.Now;
            _context.DownloadHistories.Update(newDownloadHistory);
            await _context.SaveChangesAsync();
        }

        return handler.CookieContainer;
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
