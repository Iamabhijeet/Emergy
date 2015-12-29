namespace Emergy.Core.Common
{
    public static class ConstRelations
    {
        public const string LoadAllUnitRelations = "Administrator,Clients,Reports,CustomProperties,Categories,Locations";
        public const string LoadAllReportRelations = "Creator,Location,Category,Details,Resources,Unit";
        public const string LoadAllMessageRelations = "Sender,Target,Multimedia";
        public const string LoadAllNotificationRelations = "Sender,Target";
        public static class RawQuery
        {
            public static class Delete
            {
                public const string ForUnits2Clients = "DELETE FROM units2clients WHERE UnitId=? AND ClientId=?";
            }
        }
    }
}
