using Cs_Hub.Models;

namespace ScHub.Interfaces
{
    public interface IResourceRepository
    {
        Task<IEnumerable<Resource>> GetAll();
        Task<Resource> GetById(int id);
        Task<bool> Add(Resource Resource);
        Task<bool> Update(Resource Resource);
        Task<bool> Delete(Resource Resource);
        Task<bool> Save();

    }
}