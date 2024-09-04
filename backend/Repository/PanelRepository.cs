using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Panel;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PanelRepository : IPanelRepository
    {
        ApplicationDBContext _context;
        public PanelRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Panel> AddAsync(Panel newPanel)
        {
            await _context.Panels.AddAsync(newPanel);
            await _context.SaveChangesAsync();

            return newPanel;
        }

        public async Task<Panel> GetByNameAsync(string name)
        {
            return await _context.Panels.FirstOrDefaultAsync(s => s.ModelNumber == name);
        }

        public async Task<Panel> GetPanelIdAsync(int panelId)
        {
            return await _context.Panels.FirstOrDefaultAsync(s => s.Id == panelId);
        }

        public async Task<Panel> UpdateAsync(int panelId, PanelDto panelDto)
        {
            var panelModel = await _context.Panels.FindAsync(panelId);

            if (panelModel == null)
            {
                throw new ArgumentException("That panel not found", nameof(panelId));
            }

            panelModel.BrandId = panelDto.BrandId;
            panelModel.ModelNumber = panelDto.ModelNumber;
            panelModel.Watts = panelDto.Watts;
            panelModel.Voc = panelDto.Voc;
            panelModel.Amps = panelDto.Amps;
            panelModel.Width = panelDto.Width;
            panelModel.Height = panelDto.Height;
            panelModel.Depth = panelDto.Depth;
            panelModel.Weight = panelDto.Weight;
            panelModel.FrameColor = panelDto.FrameColor;
            panelModel.Color = panelDto.Color;
            panelModel.Connectors = panelDto.Connectors;
            panelModel.Type = panelDto.Type;
            panelModel.Technology = panelDto.Technology;
            panelModel.Efficiency = panelDto.Efficiency;
            panelModel.Status = panelDto.Status;

            await _context.SaveChangesAsync();

            return panelModel;
        }

        public async Task<Panel> UpdateStatusAsync(int panelId, UpdatePanelStatusRequestDto panelDto)
        {
            var panelModel = await _context.Panels.FindAsync(panelId);

            if (panelModel == null)
            {
                throw new ArgumentException("That Panel not found", nameof(panelId));
            }

            panelModel.Status = panelDto.Status;

            if (panelDto.Status == 1)
            {
                panelModel.DateApproved = DateTime.Now;
                panelModel.ApprovedByUserId = panelDto.UserId;
            }

            await _context.SaveChangesAsync();

            return panelModel;
        }

        async Task<List<PanelDto>> IPanelRepository.GetAllAsync()
        {
            var panels = await _context.Panels.Include(x => x.Brand).Select(x => new PanelDto
            {
                Id = x.Id,
                BrandId = x.BrandId,
                Brand = x.Brand.Name,
                ModelNumber = x.ModelNumber,
                Watts = x.Watts,
                Voc = x.Voc,
                Amps = x.Amps,
                Width = x.Width,
                Height = x.Height,
                Depth = x.Depth,
                Weight = x.Weight,
                FrameColor = x.FrameColor,
                Color = x.Color,
                Connectors = x.Connectors,
                Type = x.Type,
                Technology = x.Technology,
                Efficiency = x.Efficiency,
                Status = x.Status,
                DateCreated = x.DateCreated,
                CreatedByUserId = x.CreatedByUserId,
                ApprovedByUserId = x.ApprovedByUserId,
                DateApproved = x.DateApproved,
                Documentations = _context.Documentations.Where(d => d.DeviceId == x.Id && d.Type == "panel").ToList()
            }).ToListAsync();

            return panels;
        }
    }
}