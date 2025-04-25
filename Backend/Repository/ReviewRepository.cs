using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.EntityFrameworkCore;
using ScHub.Interfaces;

namespace Cs_Hub.Repository
{
    public class ReviewRepository : IReviewRepository
    {

        private readonly ApplicationDbContext _context;
        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Review Review)
        {
            await _context.AddAsync(Review);
            return await Save();
        }

        public async Task<bool> Delete(Review Review)
        {
            var result = _context.Remove(Review);
            return await Save();
        }

        public async Task<IEnumerable<Review>> GetAll()
        {
            var result = await _context.Reviews.ToListAsync();
            return result;
        }

        public async Task<Review> GetById(int id)
        {
            var result = await _context.Reviews.FirstOrDefaultAsync(f => f.ReviewID == id);
            return result;
        }

        public async Task<bool> Save()
        {
            var save = await _context.SaveChangesAsync();
            return save > 0 ? true : false;
        }


        public Task<bool> Update(Review Review)
        {
            _context.Reviews.Update(Review);
            return Save();
        }
    }
}