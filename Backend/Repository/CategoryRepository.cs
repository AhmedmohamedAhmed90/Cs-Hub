using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.EntityFrameworkCore;
using ScHub.Interfaces;

namespace Cs_Hub.Repository
{
    public class CategoryRepository : ICategoryRepository
    {

        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Category Category)
        {
            await _context.AddAsync(Category);
            return await Save();
        }

        public async Task<bool> Delete(Category Category)
        {
            var result = _context.Remove(Category);
            return await Save();
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            var result = await _context.Categories.ToListAsync();
            return result;
        }

        public async Task<Category> GetById(int id)
        {
            var result = await _context.Categories.FirstOrDefaultAsync(f => f.CategoryID == id);
            return result;
        }

        public async Task<bool> Save()
        {
            var save = await _context.SaveChangesAsync();
            return save > 0 ? true : false;
        }


        public Task<bool> Update(Category Category)
        {
            _context.Categories.Update(Category);
            return Save();
        }
    }
}