﻿using System;
using System.Linq.Expressions;
using Emergy.Data.Models;

namespace Emergy.Core.Common
{
    public static class ConstRelations
    {
        public const string LoadAllUnitRelations = "Administrator,Clients,Reports,CustomProperties,Categories,Locations";
        public const string LoadAllReportRelations = "Creator,Location,Category,Details,Photos";
        public const string LoadAllMessageRelations = "Sender,Target,Multimedia";
        public static class RawQuery
        {
            public static class Delete
            {
                public const string ForUnits2Clients = "DELETE FROM units2clients WHERE UnitId=? AND ClientId=?";
            }
        }
    }
}
