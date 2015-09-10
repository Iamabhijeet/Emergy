using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Emergy.Core.Common;
using Emergy.Data.Context;

namespace Emergy.Core.Repositories.Generic
{
    public class Repository<T> : IRepository<T> where T : class
    {
        internal ApplicationDbContext Context;
        internal DbSet<T> DbSet;

        public Repository(ApplicationDbContext context)
        {
            Context = context;
            DbSet = context.Set<T>();
        }
        public virtual IEnumerable<T> Get(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<T> query = DbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            query = includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

            return orderBy?.Invoke(query).ToList() ?? query.ToList();
        }
        public virtual Task<IEnumerable<T>> GetAsync(
         Expression<Func<T, bool>> filter = null,
         Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
         string includeProperties = "")
        {
            return Task.Factory.StartNew(() => Get(filter, orderBy, includeProperties), TaskCreationOptions.HideScheduler);
        }
        public virtual T Get(object id)
        {
            return DbSet.Find(id);
        }
        public async virtual Task<T> GetAsync(object id)
        {
            return await DbSet.FindAsync(id).WithoutSync();
        }
        public virtual void Insert(T entity)
        {
            DbSet.Add(entity);
        }
        public virtual void Update(T entityToUpdate)
        {
            Context.Entry(entityToUpdate).State = EntityState.Modified;
            DbSet.Attach(entityToUpdate);
        }
        public virtual void Delete(object id)
        {
            Delete(DbSet.Find(id));
        }
        public virtual void Delete(T entityToDelete)
        {
            if (Context.Entry(entityToDelete).State == EntityState.Detached)
            {
                DbSet.Attach(entityToDelete);
            }
            DbSet.Remove(entityToDelete);
        }
        public virtual bool Exists(int id)
        {
            return DbSet.Find(id) != null;
        }
        public async virtual Task<bool> ExistsAsync(int id)
        {
            return await DbSet.FindAsync(id) != null;
        }

        public int Save()
        {
            return Context.SaveChanges();
        }
        public async Task SaveAsync()
        {
            await Context.SaveChangesAsync().WithoutSync();
        }
        public virtual void Dispose()
        {
            Context.Dispose();
        }
        ~Repository()
        {
            Dispose();
        }
    }
}
