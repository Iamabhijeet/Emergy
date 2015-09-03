﻿using AutoMapper;
using Emergy.Core.Models.Account;
using Emergy.Core.Models.CustomProperty;
using Emergy.Core.Models.Location;
using Emergy.Core.Models.Unit;
using Emergy.Data.Models;

namespace Emergy.Api.Mappings
{
    public static class AutoMapperConfig
    {
        private static IMappingExpression<TSource, TDestination> IgnoreUnmappedProperties<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression)
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

            Mapper.CreateMap<CreateUnitViewModel, Unit>().IgnoreUnmappedProperties();
            Mapper.CreateMap<EditUnitViewModel, Unit>().IgnoreUnmappedProperties();

            Mapper.CreateMap<CreateCustomPropertyViewModel, CustomProperty>().IgnoreUnmappedProperties();
            Mapper.CreateMap<EditCustomPropertyViewModel, CustomProperty>().IgnoreUnmappedProperties();

            Mapper.CreateMap<CreateLocationViewModel, Location>().IgnoreUnmappedProperties();
            Mapper.CreateMap<EditLocationViewModel, Location>().IgnoreUnmappedProperties();
        }
    }
}
