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
using Ninject.WebApi.DependencyResolver;
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
            kernel.Bind<ApplicationDbContext>().ToSelf().InSingletonScope();
            kernel.Bind<IRepository<Image>>().To <IRepository<Image>>();
            kernel.Bind<IReportsRepository>().To<ReportsRepository>();
            kernel.Bind<IUnitsRepository>().To<UnitsRepository>();
            kernel.Bind<IEmergyHubService>().To<EmergyHubService>()
                .WithConstructorArgument("unitsRepository", kernel.Get<IUnitsRepository>())
                .WithConstructorArgument("reportsRepository", kernel.Get<IRepository<Report>>());

            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);
        }        
    }
}
