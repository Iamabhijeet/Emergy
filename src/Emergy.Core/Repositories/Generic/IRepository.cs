using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Emergy.Core.Repositories.Generic
{
  
     public interface IRepository<T> : IDisposable where T : class
        {
            IEnumerable<T> Get(
                Expression<Func<T, bool>> filter = null,
                Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
                string includeProperties = "");

            Task<IEnumerable<T>> GetAsync(
                Expression<Func<T, bool>> filter = null,
                Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
                string includeProperties = "");


            T Get(object id);
            Task<T> GetAsync(object id);

            void Insert(T entity);
            void Update(T entityToUpdate);
            void Delete(object id);
            void Delete(T entityToDelete);

            bool Exists(int id);
            Task<bool> ExistsAsync(int id);

            int Save();
            Task SaveAsync();
        }
    
}
