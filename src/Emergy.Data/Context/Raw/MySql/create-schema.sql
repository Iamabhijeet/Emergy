create table `Assignments` (`Id` int not null  auto_increment ,`ReportId` int not null ,`TargetId` nvarchar(128)  not null ,`AdminId` nvarchar(128)  not null ,`Timestamp` datetime not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `AspNetUsers` (`Id` nvarchar(128)  not null ,`UserKeyHash` longtext not null ,`Name` longtext,`Surname` longtext,`BirthDate` datetime not null ,`Gender` int not null ,`ProfilePhotoId` int not null ,`AccountType` int not null ,`Timestamp` datetime not null ,`Email` nvarchar(256) ,`EmailConfirmed` bool not null ,`PasswordHash` longtext,`SecurityStamp` longtext,`PhoneNumber` longtext,`PhoneNumberConfirmed` bool not null ,`TwoFactorEnabled` bool not null ,`LockoutEndDateUtc` datetime,`LockoutEnabled` bool not null ,`AccessFailedCount` int not null ,`UserName` nvarchar(128)  not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `AspNetUserClaims` (`Id` int not null  auto_increment ,`UserId` nvarchar(128)  not null ,`ClaimType` longtext,`ClaimValue` longtext,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Locations` (`Id` int not null  auto_increment ,`Latitude` double not null ,`Longitude` double not null ,`Name` longtext,`Type` int not null ,`Timestamp` datetime not null ,`ApplicationUser_Id` nvarchar(128) ,`Unit_Id` int,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `AspNetUserLogins` (`LoginProvider` nvarchar(128)  not null ,`ProviderKey` nvarchar(128)  not null ,`UserId` nvarchar(128)  not null ,primary key ( `LoginProvider`,`ProviderKey`,`UserId`) ) engine=InnoDb auto_increment=0
create table `Resources` (`Id` int not null  auto_increment ,`Url` longtext,`Name` longtext,`DateUploaded` datetime not null ,`MimeType` longtext,`Base64` longtext,`Message_Id` int,`Report_Id` int,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Messages` (`Id` int not null  auto_increment ,`SenderId` nvarchar(128) ,`TargetId` nvarchar(128) ,`Content` longtext,`Timestamp` datetime not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Notifications` (`Id` int not null  auto_increment ,`SenderId` nvarchar(128) ,`TargetId` nvarchar(128) ,`Content` longtext,`Type` int not null ,`ParameterId` longtext,`Timestamp` datetime not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Reports` (`Id` int not null  auto_increment ,`Description` nvarchar(200) ,`CreatorId` nvarchar(128) ,`LocationId` int,`CategoryId` int,`DetailsId` int not null ,`Timestamp` datetime not null ,`DateHappened` datetime not null ,`Status` int not null ,`Unit_Id` int,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Categories` (`Id` int not null  auto_increment ,`Name` longtext,`Unit_Id` int,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Units` (`Id` int not null  auto_increment ,`Name` nvarchar(50)  not null ,`AdministratorId` nvarchar(128) ,`IsPublic` bool not null ,`DateCreated` datetime not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `CustomProperties` (`Id` int not null  auto_increment ,`Name` longtext not null ,`CustomPropertyType` int not null ,`Unit_Id` int not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `CustomPropertyValues` (`Id` int not null  auto_increment ,`SerializedValue` longtext,`ReportDetails_Id` int,`CustomProperty_Id` int,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `ReportDetails` (`Id` int not null  auto_increment ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `AspNetUserRoles` (`UserId` nvarchar(128)  not null ,`RoleId` nvarchar(128)  not null ,primary key ( `UserId`,`RoleId`) ) engine=InnoDb auto_increment=0
create table `AspNetRoles` (`Id` nvarchar(128)  not null ,`Name` nvarchar(128)  not null ,primary key ( `Id`) ) engine=InnoDb auto_increment=0
create table `Units2Clients` (`UnitId` int not null ,`ClientId` nvarchar(128)  not null ,primary key ( `UnitId`,`ClientId`) ) engine=InnoDb auto_increment=0
CREATE index  `IX_ReportId` on `Assignments` (`ReportId` DESC) using HASH
CREATE index  `IX_TargetId` on `Assignments` (`TargetId` DESC) using HASH
CREATE index  `IX_AdminId` on `Assignments` (`AdminId` DESC) using HASH
CREATE index  `IX_ProfilePhotoId` on `AspNetUsers` (`ProfilePhotoId` DESC) using HASH
CREATE UNIQUE index  `UserNameIndex` on `AspNetUsers` (`UserName` DESC) using HASH
CREATE index  `IX_UserId` on `AspNetUserClaims` (`UserId` DESC) using HASH
CREATE index  `IX_ApplicationUser_Id` on `Locations` (`ApplicationUser_Id` DESC) using HASH
CREATE index  `IX_Unit_Id` on `Locations` (`Unit_Id` DESC) using HASH
CREATE index  `IX_UserId` on `AspNetUserLogins` (`UserId` DESC) using HASH
CREATE index  `IX_Message_Id` on `Resources` (`Message_Id` DESC) using HASH
CREATE index  `IX_Report_Id` on `Resources` (`Report_Id` DESC) using HASH
CREATE index  `IX_SenderId` on `Messages` (`SenderId` DESC) using HASH
CREATE index  `IX_TargetId` on `Messages` (`TargetId` DESC) using HASH
CREATE index  `IX_SenderId` on `Notifications` (`SenderId` DESC) using HASH
CREATE index  `IX_TargetId` on `Notifications` (`TargetId` DESC) using HASH
CREATE index  `IX_CreatorId` on `Reports` (`CreatorId` DESC) using HASH
CREATE index  `IX_LocationId` on `Reports` (`LocationId` DESC) using HASH
CREATE index  `IX_CategoryId` on `Reports` (`CategoryId` DESC) using HASH
CREATE index  `IX_DetailsId` on `Reports` (`DetailsId` DESC) using HASH
CREATE index  `IX_Unit_Id` on `Reports` (`Unit_Id` DESC) using HASH
CREATE index  `IX_Unit_Id` on `Categories` (`Unit_Id` DESC) using HASH
CREATE index  `IX_AdministratorId` on `Units` (`AdministratorId` DESC) using HASH
CREATE index  `IX_Unit_Id` on `CustomProperties` (`Unit_Id` DESC) using HASH
CREATE index  `IX_ReportDetails_Id` on `CustomPropertyValues` (`ReportDetails_Id` DESC) using HASH
CREATE index  `IX_CustomProperty_Id` on `CustomPropertyValues` (`CustomProperty_Id` DESC) using HASH
CREATE index  `IX_UserId` on `AspNetUserRoles` (`UserId` DESC) using HASH
CREATE index  `IX_RoleId` on `AspNetUserRoles` (`RoleId` DESC) using HASH
CREATE UNIQUE index  `RoleNameIndex` on `AspNetRoles` (`Name` DESC) using HASH
CREATE index  `IX_UnitId` on `Units2Clients` (`UnitId` DESC) using HASH
CREATE index  `IX_ClientId` on `Units2Clients` (`ClientId` DESC) using HASH
alter table `Assignments` add constraint `FK_Assignments_AspNetUsers_AdminId`  foreign key (`AdminId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Assignments` add constraint `FK_Assignments_Reports_ReportId`  foreign key (`ReportId`) references `Reports` ( `Id`)  on update cascade on delete cascade 
alter table `Assignments` add constraint `FK_Assignments_AspNetUsers_TargetId`  foreign key (`TargetId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `AspNetUsers` add constraint `FK_AspNetUsers_Resources_ProfilePhotoId`  foreign key (`ProfilePhotoId`) references `Resources` ( `Id`)  on update cascade on delete cascade 
alter table `AspNetUserClaims` add constraint `FK_AspNetUserClaims_AspNetUsers_UserId`  foreign key (`UserId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Locations` add constraint `FK_Locations_AspNetUsers_ApplicationUser_Id`  foreign key (`ApplicationUser_Id`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Locations` add constraint `FK_Locations_Units_Unit_Id`  foreign key (`Unit_Id`) references `Units` ( `Id`)  on update cascade on delete cascade 
alter table `AspNetUserLogins` add constraint `FK_AspNetUserLogins_AspNetUsers_UserId`  foreign key (`UserId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Resources` add constraint `FK_Resources_Messages_Message_Id`  foreign key (`Message_Id`) references `Messages` ( `Id`) 
alter table `Resources` add constraint `FK_Resources_Reports_Report_Id`  foreign key (`Report_Id`) references `Reports` ( `Id`)  on update cascade on delete cascade 
alter table `Messages` add constraint `FK_Messages_AspNetUsers_SenderId`  foreign key (`SenderId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Messages` add constraint `FK_Messages_AspNetUsers_TargetId`  foreign key (`TargetId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Notifications` add constraint `FK_Notifications_AspNetUsers_SenderId`  foreign key (`SenderId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Notifications` add constraint `FK_Notifications_AspNetUsers_TargetId`  foreign key (`TargetId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `Reports` add constraint `FK_Reports_Units_Unit_Id`  foreign key (`Unit_Id`) references `Units` ( `Id`)  on update cascade on delete cascade 
alter table `Reports` add constraint `FK_Reports_Categories_CategoryId`  foreign key (`CategoryId`) references `Categories` ( `Id`) 
alter table `Reports` add constraint `FK_Reports_AspNetUsers_CreatorId`  foreign key (`CreatorId`) references `AspNetUsers` ( `Id`) 
alter table `Reports` add constraint `FK_Reports_ReportDetails_DetailsId`  foreign key (`DetailsId`) references `ReportDetails` ( `Id`)  on update cascade on delete cascade 
alter table `Reports` add constraint `FK_Reports_Locations_LocationId`  foreign key (`LocationId`) references `Locations` ( `Id`) 
alter table `Categories` add constraint `FK_Categories_Units_Unit_Id`  foreign key (`Unit_Id`) references `Units` ( `Id`)  on update cascade on delete cascade 
alter table `Units` add constraint `FK_Units_AspNetUsers_AdministratorId`  foreign key (`AdministratorId`) references `AspNetUsers` ( `Id`) 
alter table `CustomProperties` add constraint `FK_CustomProperties_Units_Unit_Id`  foreign key (`Unit_Id`) references `Units` ( `Id`)  on update cascade on delete cascade 
alter table `CustomPropertyValues` add constraint `FK_CustomPropertyValues_ReportDetails_ReportDetails_Id`  foreign key (`ReportDetails_Id`) references `ReportDetails` ( `Id`)  on update cascade on delete cascade 
alter table `CustomPropertyValues` add constraint `FK_8f944ceed80246c183bfed98e7c86aae`  foreign key (`CustomProperty_Id`) references `CustomProperties` ( `Id`)  on update cascade on delete cascade 
alter table `AspNetUserRoles` add constraint `FK_AspNetUserRoles_AspNetUsers_UserId`  foreign key (`UserId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
alter table `AspNetUserRoles` add constraint `FK_AspNetUserRoles_AspNetRoles_RoleId`  foreign key (`RoleId`) references `AspNetRoles` ( `Id`)  on update cascade on delete cascade 
alter table `Units2Clients` add constraint `FK_Units2Clients_Units_UnitId`  foreign key (`UnitId`) references `Units` ( `Id`)  on update cascade on delete cascade 
alter table `Units2Clients` add constraint `FK_Units2Clients_AspNetUsers_ClientId`  foreign key (`ClientId`) references `AspNetUsers` ( `Id`)  on update cascade on delete cascade 
create table `__MigrationHistory` (`MigrationId` nvarchar(100)  not null ,`ContextKey` nvarchar(200)  not null ,`Model` longblob not null ,`ProductVersion` nvarchar(32)  not null ,primary key ( `MigrationId`,`ContextKey`) ) engine=InnoDb auto_increment=0