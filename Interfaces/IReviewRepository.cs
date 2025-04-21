using Cs_Hub.Models;

namespace ScHub.Interfaces
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetAll();
        Task<Review> GetById(int id);
        Task<bool> Add(Review Review);
        Task<bool> Update(Review Review);
        Task<bool> Delete(Review Review);
        Task<bool> Save();

    }
}