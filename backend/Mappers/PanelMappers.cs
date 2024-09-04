using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Panel;
using backend.Models;

namespace backend.Mappers
{
    public static class PanelMappers
    {
        public static PanelDto ToPanelDto(this Panel panelModel)
        {
            return new PanelDto
            {
                Id = panelModel.Id,
                Brand = panelModel.Brand.Name,
                BrandId = panelModel.Brand.Id,
                ModelNumber = panelModel.ModelNumber,
                Watts = panelModel.Watts,
                Voc = panelModel.Voc,
                Amps = panelModel.Amps,
                Width = panelModel.Width,
                Height = panelModel.Height,
                Depth = panelModel.Depth,
                Weight = panelModel.Weight,
                FrameColor = panelModel.FrameColor,
                Color = panelModel.Color,
                Connectors = panelModel.Connectors,
                Type = panelModel.Type,
                Technology = panelModel.Technology,
                Efficiency = panelModel.Efficiency
            };
        }
    }
}