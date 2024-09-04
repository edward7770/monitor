using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Panel;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPanelRepository
    {
        Task<List<PanelDto>> GetAllAsync();
        Task<Panel> AddAsync(Panel newPanel);
        Task<Panel> GetByNameAsync(string name);
        Task<Panel> GetPanelIdAsync(int panelId);
        Task<Panel> UpdateAsync(int panelId, PanelDto panelDto);
        Task<Panel> UpdateStatusAsync(int panelId, UpdatePanelStatusRequestDto panelDto);
    }
}