
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Emergy.Core.Common
{
    public static class TaskExtensions
    {
        public static ConfiguredTaskAwaitable WithoutSync(this Task task)
        {
            return task.ConfigureAwait(false);
        }
        public static ConfiguredTaskAwaitable<T> WithoutSync<T>(this Task<T> task)
        {
            return task.ConfigureAwait(false);
        }
        public static ConfiguredTaskAwaitable Sync(this Task task)
        {
            return task.ConfigureAwait(true);
        }
        public static ConfiguredTaskAwaitable<T> Sync<T>(this Task<T> task)
        {
            return task.ConfigureAwait(true);
        }
    }
}
