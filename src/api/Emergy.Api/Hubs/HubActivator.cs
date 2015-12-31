using Microsoft.AspNet.SignalR.Hubs;
using Ninject;

namespace Emergy.Api.Hubs
{
    public class HubActivator : IHubActivator
    {
        private readonly IKernel _container;

        public HubActivator(IKernel container)
        {
            this._container = container;
        }

        public IHub Create(HubDescriptor descriptor)
        {
            return (IHub)_container.GetService(descriptor.HubType);
        }
    }
}
