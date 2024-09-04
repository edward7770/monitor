using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Solution;
using backend.Interfaces;
using backend.Models;
using backend.Service;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class SolutionRepository : ISolutionRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly ISmtpService _smtpService;
        private readonly IDocumentationRepository _documentationRepo;
        public SolutionRepository(ApplicationDBContext context, ISmtpService smtpService, IDocumentationRepository documentationRepo)
        {
            _context = context;
            _smtpService = smtpService;
            _documentationRepo = documentationRepo;
        }

        public async Task<Solution> AddAsync(Solution newSolution)
        {
            await _context.Solutions.AddAsync(newSolution);
            await _context.SaveChangesAsync();

            return newSolution;
        }

        public async Task<List<SolutionWithDetailDto>> GetAllAsync()
        {

            var solutions =  await _context.Solutions
                .Include(s => s.Supplier)
                .Include(s => s.RejectedReason)
                .Include(s => s.SolutionDetail)
                .ThenInclude(sd => sd.Inverter)
                .ThenInclude(x => x.Brand)
                .Include(s => s.SolutionDetail)
                .ThenInclude(sd => sd.Panel)
                .ThenInclude(x => x.Brand)
                .Include(s => s.SolutionDetail)
                .ThenInclude(sd => sd.Storage)
                .ThenInclude(x => x.Brand)
                .Select(x => new SolutionWithDetailDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Price = x.Price,
                    EquipmentPrice = x.EquipmentPrice,
                    SupplierId = x.SupplierId,
                    Supplier = x.Supplier,
                    DateCreated = x.DateCreated,
                    CreatedByUserId = x.CreatedByUserId,
                    Status = x.Status,
                    DateApprove = x.DateApprove,
                    RejectedReason = x.RejectedReason,
                    Provinces = _context.SolutionProvinces.Where(d => d.SolutionId == x.Id).Select(sp => sp.Province).ToList(),
                    SolutionDetail = new Dtos.SolutionDetail.SolutionDetailDto
                    {
                        Id = x.SolutionDetail.Id,
                        PanelCount = x.SolutionDetail.PanelCount,
                        StorageCount = x.SolutionDetail.StorageCount,
                        StringCount = x.SolutionDetail.StringCount,
                        Inverter = new Dtos.Inverter.InverterDto
                        {
                            Id = x.SolutionDetail.Inverter.Id,
                            BrandId = x.SolutionDetail.Inverter.BrandId,
                            Brand = x.SolutionDetail.Inverter.Brand.Name,
                            ModelNumber = x.SolutionDetail.Inverter.ModelNumber,
                            Volts = x.SolutionDetail.Inverter.Volts,
                            KVA = x.SolutionDetail.Inverter.KVA,
                            Voc = x.SolutionDetail.Inverter.Voc,
                            Strings = x.SolutionDetail.Inverter.Strings,
                            MaxMPPTVolts = x.SolutionDetail.Inverter.MaxMPPTVolts,
                            MaxMPPTWatts = x.SolutionDetail.Inverter.MaxMPPTWatts,
                            MaxMPPTAmps = x.SolutionDetail.Inverter.MaxMPPTAmps,
                            PhaseCount = x.SolutionDetail.Inverter.PhaseCount,
                            PVOperatingVoltageRange = x.SolutionDetail.Inverter.PVOperatingVoltageRange,
                            Efficiency = x.SolutionDetail.Inverter.Efficiency,
                            Documentations = _context.Documentations.Where(d => d.DeviceId == x.SolutionDetail.Inverter.Id && d.Type == "inverter").ToList()
                        },
                        Storage = x.SolutionDetail.Storage == null ? null : new Dtos.Storage.StorageDto
                        {
                            Id = x.SolutionDetail.Storage.Id,
                            BrandId = x.SolutionDetail.Storage.BrandId,
                            Brand = x.SolutionDetail.Storage.Brand.Name,
                            ModelNumber = x.SolutionDetail.Storage.ModelNumber,
                            Watts = x.SolutionDetail.Storage.Watts,
                            Volts = x.SolutionDetail.Storage.Volts,
                            Amps = x.SolutionDetail.Storage.Amps,
                            MaxChargingVoltage = x.SolutionDetail.Storage.MaxChargingVoltage,
                            FloatChargingVoltage = x.SolutionDetail.Storage.FloatChargingVoltage,
                            MaxChargeAmps = x.SolutionDetail.Storage.MaxChargeAmps,
                            Weight = x.SolutionDetail.Storage.Weight,
                            Documentations = _context.Documentations.Where(d => d.DeviceId == x.SolutionDetail.Storage.Id && d.Type == "storage").ToList()
                        },
                        Panel = new Dtos.Panel.PanelDto
                        {
                            Id = x.SolutionDetail.Panel.Id,
                            BrandId = x.SolutionDetail.Panel.BrandId,
                            Brand = x.SolutionDetail.Panel.Brand.Name,
                            ModelNumber = x.SolutionDetail.Panel.ModelNumber,
                            Watts = x.SolutionDetail.Panel.Watts,
                            Voc = x.SolutionDetail.Panel.Voc,
                            Amps = x.SolutionDetail.Panel.Amps,
                            Width = x.SolutionDetail.Panel.Width,
                            Height = x.SolutionDetail.Panel.Height,
                            Depth = x.SolutionDetail.Panel.Depth,
                            Weight = x.SolutionDetail.Panel.Weight,
                            FrameColor = x.SolutionDetail.Panel.FrameColor,
                            Color = x.SolutionDetail.Panel.Color,
                            Connectors = x.SolutionDetail.Panel.Connectors,
                            Type = x.SolutionDetail.Panel.Type,
                            Technology = x.SolutionDetail.Panel.Technology,
                            Efficiency = x.SolutionDetail.Panel.Efficiency,
                            Documentations = _context.Documentations.Where(d => d.DeviceId == x.SolutionDetail.Panel.Id && d.Type == "panel").ToList()
                        }
                    },
                })
                .ToListAsync();

            return solutions;

        }

        public async Task<Solution> GetByNameAsync(string name)
        {
            return await _context.Solutions.FirstOrDefaultAsync(s => s.Name == name);
        }

        public async Task<Solution> GetBySolutionId(int solutionId)
        {
            return await _context.Solutions.FindAsync(solutionId);
        }

        public async Task<Solution> UpdateStatusAsync(int solutionId, UpdateSolutionStatusRequestDto statusDto)
        {
            var solution = await _context.Solutions.FindAsync(solutionId);


            if (solution == null)
            {
                throw new ArgumentException("Solution not found", nameof(solutionId));
            }

            solution.Status = statusDto.Status;

            if(statusDto.Status == 1){
                solution.DateApprove = statusDto.DateApprove;
                solution.ApprovedByUserId = statusDto.ApprovedByUserId;
            }

            if(statusDto.Status == 3){
                var solutionRejectedReason =  await _context.RejectedReasons.FirstOrDefaultAsync(s => s.SolutionId == solution.Id);

                if(solutionRejectedReason == null) {
                    var newRejectedReason = new RejectedReason{
                        SolutionId = solution.Id,
                        Reason = statusDto.RejectedReason,
                        RejectedDate = statusDto.DateApprove,
                        RejectedByUserId = statusDto.ApprovedByUserId
                    };
                    solutionRejectedReason = newRejectedReason;
                    await _context.RejectedReasons.AddAsync(newRejectedReason);
                } else {
                    solutionRejectedReason.Reason = statusDto.RejectedReason;
                    solutionRejectedReason.RejectedDate = statusDto.DateApprove;
                    solutionRejectedReason.RejectedByUserId = statusDto.ApprovedByUserId;
                }

                var supplier =  await _context.Suppliers.FindAsync(solution.SupplierId);

                await _smtpService.RejectedMailBySmtp(supplier, solutionRejectedReason, solution);
            }
            
            await _context.SaveChangesAsync();

            return solution;
        }

        public async Task<Solution> GetSolutionById(int solutionId)
        {
           return await _context.Solutions.FindAsync(solutionId); 
        }

        public async Task<Solution> UpdateSolutionAsync(int solutionId, UpdateSolutionRequestDto solutionDto)
        {
            var solutionModel = await _context.Solutions.FindAsync(solutionId);
            
            if(solutionModel == null) 
            {
                throw new ArgumentException("That Solution not found", nameof(solutionId));
            }

            solutionModel.Name = solutionDto.Name;
            solutionModel.Description = solutionDto.Description;
            solutionModel.Price = solutionDto.Price;
            solutionModel.EquipmentPrice = solutionDto.EquipmentPrice;
            solutionModel.Status = solutionDto.Status;
            solutionModel.DateApprove = DateTime.Now;

            await _context.SaveChangesAsync();

            return solutionModel;
        }
    }
}