using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Emergy.Api.Controllers;
using Emergy.Api.Data.Context;
using Emergy.Api.Data.Models;
using Emergy.Api.Data.Models.Enums;
using Emergy.Api.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Emergy.Api.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        public AccountControllerTests()
        {
            
        }
      
        [TestMethod]
        public void Mappings()
        {
            Mapper.CreateMap<RegisterUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
            Mapper.CreateMap<LoginUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
            var register = new Models.RegisterUserBindingModel()
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
            var logIn = new Models.LoginUserBindingModel()
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
                Configuration = new System.Web.Http.HttpConfiguration(),
                Request = new System.Net.Http.HttpRequestMessage()
            };
            var model = new Models.RegisterUserBindingModel()
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
            var result = await action.ExecuteAsync(new System.Threading.CancellationToken());

            Assert.IsTrue(result.IsSuccessStatusCode);


        }

        [TestMethod]
        public async Task Login()
        {
            DbContext ctx = new ApplicationDbContext();
            var controller = new AccountApiController(new ApplicationUserManager(new UserStore<ApplicationUser>(ctx)))
            {
                Configuration = new System.Web.Http.HttpConfiguration(),
                Request = new System.Net.Http.HttpRequestMessage()
            };
            var model = new Models.LoginUserBindingModel()
            {
                UserName = "gboduljak",
                Password = "damngoood"
            };

            var action = await controller.Login(model);
            var result = await action.ExecuteAsync(new System.Threading.CancellationToken());

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
