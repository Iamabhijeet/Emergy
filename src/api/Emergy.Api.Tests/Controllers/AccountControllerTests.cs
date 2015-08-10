using System;
using System.Data.Entity;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Emergy.Api.Controllers;
using Emergy.Api.Models;
using Emergy.Api.Models.Account;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Emergy.Api.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        [TestMethod]
        public void Mappings()
        {
            Mapper.CreateMap<RegisterUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
            Mapper.CreateMap<LoginUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
            var register = new RegisterUserBindingModel
            {
                UserName = "gboduljak",
                Name = "Gabrijel",
                Surname = "Boduljak",
                Email = "gboduljak@outlook.com",
                Gender = Gender.Male,
                Password = "damngoood123",
                ConfirmPassword = "damngoood123",
                Country = "Croatia",
                BirthDate = DateTime.Now

            };
            var logIn = new LoginUserBindingModel
            {
                UserName = "gboduljak",
                Password = "damngoood123"
            };
            Mapper.AssertConfigurationIsValid();
            var dest1 = Mapper.Map<ApplicationUser>(register);
            var dest2 = Mapper.Map<ApplicationUser>(logIn);
        }
        [TestMethod]
        public async Task Register()
        {
            DbContext ctx = new ApplicationDbContext();
            var controller = new AccountApiController(new ApplicationUserManager(new UserStore<ApplicationUser>(ctx)))
            {
                Configuration = new HttpConfiguration(),
                Request = new HttpRequestMessage()
            };
            var model = new RegisterUserBindingModel
            {
                UserName = "gboduljak",
                Name = "Gabrijel",
                Surname = "Boduljak",
                Email = "gboduljak@outlook.com",
                Gender = Gender.Male,
                Password = "damngoood123",
                ConfirmPassword = "damngoood123",
                Country = "Croatia",
                BirthDate = DateTime.Now

            };
            var action = await controller.Register(model);
            var result = await action.ExecuteAsync(new CancellationToken());

            Assert.IsTrue(result.IsSuccessStatusCode);
        }

        [TestMethod]
        public async Task Login()
        {
            DbContext ctx = new ApplicationDbContext();
            var controller = new AccountApiController(new ApplicationUserManager(new UserStore<ApplicationUser>(ctx)))
            {
                Configuration = new HttpConfiguration(),
                Request = new HttpRequestMessage()
            };
            var model = new LoginUserBindingModel
            {
                UserName = "gboduljak",
                Password = "damngoood123"
            };

            var action = await controller.Login(model);
            var result = await action.ExecuteAsync(new CancellationToken());

            Assert.IsTrue(result.IsSuccessStatusCode);
        }
    }

    public static class MapperExstensions
    {
        public static IMappingExpression<TSource, TDestination> IgnoreUnmappedProperties<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression)
        {
            var typeMap = Mapper.FindTypeMapFor<TSource, TDestination>();
            if (typeMap != null)
            {
                foreach (var unmappedPropertyName in typeMap.GetUnmappedPropertyNames())
                {
                    expression.ForMember(unmappedPropertyName, opt => opt.Ignore());
                }
            }
            return expression;
        }
    }
}
