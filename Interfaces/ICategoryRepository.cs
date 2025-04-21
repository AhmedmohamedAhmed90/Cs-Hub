using Cs_Hub.Models;

namespace ScHub.Interfaces
{
	public interface ICategoryRepository
	{
		Task<IEnumerable<Category>> GetAll();
		Task<Category> GetById(int id);
		Task<bool> Add(Category Category);
		Task<bool> Update(Category Category);
		Task<bool> Delete(Category Category);
		Task<bool> Save();

	}
}