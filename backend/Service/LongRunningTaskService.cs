using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class LongRunningTaskService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<LongRunningTaskService> _logger;
    private readonly ConcurrentDictionary<Guid, TaskStatus> _taskStatuses = new();

    public LongRunningTaskService(IServiceScopeFactory scopeFactory, ILogger<LongRunningTaskService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // Adjust delay as needed

            // Check for and process pending tasks
        }
    }

    public Guid StartLongRunningQuery(int[] ids)
    {
        var taskId = Guid.NewGuid();
        _taskStatuses[taskId] = TaskStatus.Running;

        Task.Run(async () =>
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

                    // Perform the query
                    var results = await dbContext.Matches
                        .Where(m => ids.Contains(m.Id))
                        .ToListAsync();

                    // Process results (e.g., save to another table or cache)
                    _logger.LogInformation($"Task {taskId} completed with {results.Count} results.");
                }

                _taskStatuses[taskId] = TaskStatus.Completed;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Task {taskId} failed.");
                _taskStatuses[taskId] = TaskStatus.Failed;
            }
        });

        return taskId;
    }

    public TaskStatus GetTaskStatus(Guid taskId)
    {
        return _taskStatuses.TryGetValue(taskId, out var status) ? status : TaskStatus.NotFound;
    }
}

public enum TaskStatus
{
    NotFound,
    Running,
    Completed,
    Failed
}
