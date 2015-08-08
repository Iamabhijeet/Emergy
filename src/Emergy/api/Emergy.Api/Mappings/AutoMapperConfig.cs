using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Emergy.Api.Data.Models;
using Emergy.Api.Models;

namespace Emergy.Api.Mappings
{
    public static class AutoMapperConfig
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
        public static void Configure()
        {
            Mapper.CreateMap<RegisterUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
            Mapper.CreateMap<LoginUserBindingModel, ApplicationUser>().IgnoreUnmappedProperties();
        }
    }
}
