using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IProspectVoucherRepository
    {
        Task<ProspectVoucherList> AddProspectVoucherListAsync(ProspectVoucherList ProspectVoucherList);
        Task<ProspectVoucher> AddProspectVoucherAsync(ProspectVoucher ProspectVoucher);
        Task<ProspectVoucherList> UpdateEmailsCountAsync(Guid ProspectVoucherListId, int EmailsCount);
        Task<ProspectVoucher> GetProspectVoucherByNumberAsync(string voucherNumber);
        Task<ProspectVoucher> UpdateClickEventAsync(Guid prospectVoucherListId, Guid prospectVoucherId);
        Task<ProspectVoucher> UpdateClaimEventAsync(Guid prospectVoucherListId, Guid prospectVoucherId);
        Task<List<ProspectVoucherList>> GetAllProspectVoucherAsync();
    }
}