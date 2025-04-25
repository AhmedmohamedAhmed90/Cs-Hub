using Cs_Hub.Data;
using Cs_Hub.Models;
using Microsoft.EntityFrameworkCore;
using ScHub.Interfaces;

namespace Cs_Hub.Repository
{
    public class CommentRepository : ICommentRepository
    {

        private readonly ApplicationDbContext _context;
        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Comment Comment)
        {
            await _context.AddAsync(Comment);
            return await Save();
        }

        public async Task<bool> Delete(Comment Comment)
        {
            var result = _context.Remove(Comment);
            return await Save();
        }

        public async Task<IEnumerable<Comment>> GetAll()
        {
            var result = await _context.Comments.ToListAsync();
            return result;
        }

        public async Task<Comment> GetById(int id)
        {
            var result = await _context.Comments.FirstOrDefaultAsync(f => f.CommentID == id);
            return result;
        }

        public async Task<bool> Save()
        {
            var save = await _context.SaveChangesAsync();
            return save > 0 ? true : false;
        }


        public Task<bool> Update(Comment Comment)
        {
            _context.Comments.Update(Comment);
            return Save();
        }
    }
}