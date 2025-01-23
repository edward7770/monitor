using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ProspectVoucherRepository : IProspectVoucherRepository
    {
        ApplicationDBContext _context;
        public ProspectVoucherRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ProspectVoucher> AddProspectVoucherAsync(ProspectVoucher ProspectVoucher)
        {
            await _context.ProspectVouchers.AddAsync(ProspectVoucher);
            await _context.SaveChangesAsync();
            return ProspectVoucher;
        }

        public async Task<ProspectVoucherList> AddProspectVoucherListAsync(ProspectVoucherList ProspectVoucherList)
        {
            await _context.ProspectVoucherLists.AddAsync(ProspectVoucherList);
            await _context.SaveChangesAsync();
            return ProspectVoucherList;
        }

        public async Task<ProspectVoucher> GetProspectVoucherByNumberAsync(string voucherNumber)
        {
            var prospectVoucher = await _context.ProspectVouchers.Where(x => x.VoucherNumber == voucherNumber).FirstOrDefaultAsync();

            if (prospectVoucher == null)
            {
                return null;
            }

            return prospectVoucher;
        }

        public async Task<ProspectVoucher> UpdateClickEventAsync(Guid prospectVoucherListId, Guid prospectVoucherId)
        {
            var prospectVoucherList = await _context.ProspectVoucherLists
                                                    .Where(x => x.Id == prospectVoucherListId)
                                                    .FirstOrDefaultAsync();

            if (prospectVoucherList == null)
            {
                throw new ArgumentException("Prospect Voucher List not found.", nameof(prospectVoucherListId));
            }

            var prospectVoucher = await _context.ProspectVouchers
                                                .Where(x => x.Id == prospectVoucherId)
                                                .FirstOrDefaultAsync();

            if (prospectVoucher == null)
            {
                throw new ArgumentException("Prospect Voucher not found.", nameof(prospectVoucherId));
            }

            if(prospectVoucher.ClickedDate != null)
            {
                return prospectVoucher;
            }

            prospectVoucherList.ClickedCount += 1;
            prospectVoucher.ClickedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return prospectVoucher;
        }

        public async Task<ProspectVoucher> UpdateClaimEventAsync(Guid prospectVoucherListId, Guid prospectVoucherId)
        {
            var prospectVoucherList = await _context.ProspectVoucherLists
                                                    .Where(x => x.Id == prospectVoucherListId)
                                                    .FirstOrDefaultAsync();

            if (prospectVoucherList == null)
            {
                throw new ArgumentException("Prospect Voucher List not found.", nameof(prospectVoucherListId));
            }

            var prospectVoucher = await _context.ProspectVouchers
                                                .Where(x => x.Id == prospectVoucherId)
                                                .FirstOrDefaultAsync();

            if (prospectVoucher == null)
            {
                throw new ArgumentException("Prospect Voucher not found.", nameof(prospectVoucherId));
            }

            if(prospectVoucher.ClaimedDate != null)
            {
                throw new ArgumentException("Prospect Voucher already used!", nameof(prospectVoucherId));
            }

            prospectVoucherList.ClaimedCount += 1;
            prospectVoucher.ClaimedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return prospectVoucher;
        }


        public async Task<ProspectVoucherList> UpdateEmailsCountAsync(Guid ProspectVoucherListId, int EmailsCount)
        {
            var prospectVoucherList = await _context.ProspectVoucherLists.FindAsync(ProspectVoucherListId);
            prospectVoucherList.EmailsCount = EmailsCount;
            await _context.SaveChangesAsync();
            return prospectVoucherList;
        }

        public async Task<List<ProspectVoucherList>> GetAllProspectVoucherAsync()
        {
            var vouchers = await _context.ProspectVoucherLists.OrderByDescending(v => v.DateCreated).ToListAsync();

            return vouchers;
        }
    }
}