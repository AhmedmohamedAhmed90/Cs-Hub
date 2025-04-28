using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.EntityFrameworkCore;
using ScHub.Interfaces;

namespace Cs_Hub.Repository
{
    public class ResourceRepository : IResourceRepository
    {

        private readonly ApplicationDbContext _context;
        public ResourceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Resource Resource)
        {
            await _context.AddAsync(Resource);
            return await Save();
        }

        public async Task<bool> Delete(Resource Resource)
        {
            var result = _context.Remove(Resource);
            return await Save();
        }

        public async Task<IEnumerable<Resource>> GetAll()
        {
            var result = await _context.Resources.ToListAsync();
            return result;
        }

        public async Task<Resource> GetById(int id)
        {
            var result = await _context.Resources.FirstOrDefaultAsync(f => f.ResourceID == id);
            return result;
        }

        public async Task<bool> Save()
        {
            var save = await _context.SaveChangesAsync();
            return save > 0 ? true : false;
        }


        public Task<bool> Update(Resource Resource)
        {
            _context.Resources.Update(Resource);
            return Save();
        }

        public async Task<IEnumerable<Resource>> Search(string query)
        {
            return await _context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Where(r => r.Title.Contains(query) || r.Description.Contains(query))
                .ToListAsync();
        }
    }
}