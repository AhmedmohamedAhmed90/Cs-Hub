using Cs_Hub.Models;

namespace ScHub.Interfaces
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetAll();
        Task<Comment> GetById(int id);
        Task<bool> Add(Comment Comment);
        Task<bool> Update(Comment Comment);
        Task<bool> Delete(Comment Comment);
        Task<bool> Save();

    }
}