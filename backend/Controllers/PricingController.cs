using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Pricing;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/pricing")]
    [ApiController]
    public class PricingController : ControllerBase
    {
        readonly private IPricingRepository _pricingRepo;
        public PricingController(IPricingRepository pricingRepo)
        {
            _pricingRepo = pricingRepo;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetPricingLists([FromQuery] int priceListId = 0)
        {
            var pricingList = await _pricingRepo.GetPricingsByListId(priceListId);

            if (pricingList == null)
            {
                return StatusCode(403, "Failed to fetch pricing list.");
            }

            return Ok(pricingList);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPricingLists()
        {
            var pricingList = await _pricingRepo.GetAllPricingsAsync();

            if (pricingList == null)
            {
                return StatusCode(403, "Failed to fetch pricing list.");
            }

            return Ok(pricingList);
        }

        [HttpPost("delete/{priceId}")]
        public async Task<IActionResult> DeletePricingTier(int priceId)
        {
            var pricing = await _pricingRepo.DeletePricingTierAsync(priceId);

            if (pricing == null)
            {
                return StatusCode(403, "That pricing tier was linked to client. Failed to delete this tier!");
            }

            return Ok(pricing);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePricingTier(PricingTierDto pricingTierDto)
        {
            var newPricing = new Pricing {
                List = pricingTierDto.List,
                ListName = pricingTierDto.ListName,
                Tier = pricingTierDto.Tier,
                Description = pricingTierDto.Description,
                Start = pricingTierDto.Start,
                End = pricingTierDto.End,
                Price = pricingTierDto.Price
            };

            var pricing = await _pricingRepo.AddPricingTierAsync(newPricing);

            return Ok(pricing);
        }

        [HttpPost("update/{priceId}")]
        public async Task<IActionResult> UpdatePricingTier(int priceId, [FromBody] PricingTierDto pricingTierDto)
        {
            var updatedPricingTier = new Pricing {
                List = pricingTierDto.List,
                ListName = pricingTierDto.ListName,
                Tier = pricingTierDto.Tier,
                Description = pricingTierDto.Description,
                Start = pricingTierDto.Start,
                End = pricingTierDto.End,
                Price = pricingTierDto.Price
            };

            var pricing = await _pricingRepo.UpdatePricingTierAsync(priceId, updatedPricingTier);

            return Ok(pricing);
        }

        [HttpPost("duplicate")]
        public async Task<IActionResult> DuplicatePriceList([FromBody] DuplicatePriceListRequestDto duplicatePriceListRequestDto)
        {
            var priceList = await _pricingRepo.DuplicatePriceListAsync(duplicatePriceListRequestDto.newListName);

            if (priceList == null)
            {
                return StatusCode(403, "Failed to duplicate price list!");
            }

            return Ok(priceList);
        }
    }
}