using System;
using System.Web;
using System.Web.Http;
using Emergy.Api;
using Emergy.Core.Repositories;
using Emergy.Core.Repositories.Generic;
using Emergy.Core.Services;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.WebApi;
using WebActivator;

[assembly: WebActivator.PreApplicationStartMethod(typeof(NinjectWebCommon), "Start")]
[assembly: ApplicationShutdownMethod(typeof(NinjectWebCommon), "Stop")]

namespace Emergy.Api
{
    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper Bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            Bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            Bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
            
            RegisterServices(kernel);
            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<ApplicationDbContext>().ToSelf().InRequestScope();
            kernel.Bind<IRepository<Resource>>().To<Repository<Resource>>();
            kernel.Bind<IRepository<Location>>().To<Repository<Location>>();
            kernel.Bind<IRepository<CustomProperty>>().To<Repository<CustomProperty>>();
            kernel.Bind<IRepository<CustomPropertyValue>>().To<Repository<CustomPropertyValue>>();
            kernel.Bind<IRepository<Category>>().To<Repository<Category>>();
            kernel.Bind<IReportsRepository>().To<ReportsRepository>();
            kernel.Bind<IUnitsRepository>().To<UnitsRepository>();

            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);
        }        
    }
}
