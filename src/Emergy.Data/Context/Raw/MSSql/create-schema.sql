CREATE TABLE [dbo].[Assignments] (
    [Id] [int] NOT NULL IDENTITY,
    [ReportId] [int] NOT NULL,
    [TargetId] [nvarchar](128) NOT NULL,
    [AdminId] [nvarchar](128) NOT NULL,
    [Timestamp] [datetime] NOT NULL,
    CONSTRAINT [PK_dbo.Assignments] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AspNetUsers] (
    [Id] [nvarchar](128) NOT NULL,
    [UserKeyHash] [nvarchar](max) NOT NULL,
    [Name] [nvarchar](max),
    [Surname] [nvarchar](max),
    [BirthDate] [datetime2] NOT NULL,
    [Gender] [int] NOT NULL,
    [ProfilePhotoId] [int] NOT NULL,
    [AccountType] [int] NOT NULL,
    [Timestamp] [datetime2] NOT NULL,
    [Email] [nvarchar](256),
    [EmailConfirmed] [bit] NOT NULL,
    [PasswordHash] [nvarchar](max),
    [SecurityStamp] [nvarchar](max),
    [PhoneNumber] [nvarchar](max),
    [PhoneNumberConfirmed] [bit] NOT NULL,
    [TwoFactorEnabled] [bit] NOT NULL,
    [LockoutEndDateUtc] [datetime2],
    [LockoutEnabled] [bit] NOT NULL,
    [AccessFailedCount] [int] NOT NULL,
    [UserName] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id] [int] NOT NULL IDENTITY,
    [UserId] [nvarchar](128) NOT NULL,
    [ClaimType] [nvarchar](max),
    [ClaimValue] [nvarchar](max),
    CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Locations] (
    [Id] [int] NOT NULL IDENTITY,
    [Latitude] [float] NOT NULL,
    [Longitude] [float] NOT NULL,
    [Name] [nvarchar](max),
    [Type] [int] NOT NULL,
    [Timestamp] [datetime2] NOT NULL,
    [ApplicationUser_Id] [nvarchar](128),
    [Unit_Id] [int],
    CONSTRAINT [PK_dbo.Locations] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] [nvarchar](128) NOT NULL,
    [ProviderKey] [nvarchar](128) NOT NULL,
    [UserId] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey], [UserId])
)
CREATE TABLE [dbo].[Resources] (
    [Id] [int] NOT NULL IDENTITY,
    [Url] [nvarchar](max),
    [Name] [nvarchar](max),
    [DateUploaded] [datetime2] NOT NULL,
    [MimeType] [nvarchar](max),
    [Base64] [nvarchar](max),
    [ReportId] [int],
    [MessageId] [int],
    CONSTRAINT [PK_dbo.Resources] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Messages] (
    [Id] [int] NOT NULL IDENTITY,
    [SenderId] [nvarchar](128),
    [TargetId] [nvarchar](128),
    [Content] [nvarchar](max),
    [Timestamp] [datetime2] NOT NULL,
    CONSTRAINT [PK_dbo.Messages] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Reports] (
    [Id] [int] NOT NULL IDENTITY,
    [Description] [nvarchar](200),
    [CreatorId] [nvarchar](128),
    [LocationId] [int],
    [CategoryId] [int],
    [DetailsId] [int] NOT NULL,
    [Timestamp] [datetime2] NOT NULL,
    [DateHappened] [datetime2] NOT NULL,
    [Status] [int] NOT NULL,
    [Unit_Id] [int],
    CONSTRAINT [PK_dbo.Reports] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Categories] (
    [Id] [int] NOT NULL IDENTITY,
    [Name] [nvarchar](max),
    [Unit_Id] [int],
    CONSTRAINT [PK_dbo.Categories] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Units] (
    [Id] [int] NOT NULL IDENTITY,
    [Name] [nvarchar](50) NOT NULL,
    [AdministratorId] [nvarchar](128),
    [IsPublic] [bit] NOT NULL,
    [DateCreated] [datetime2] NOT NULL,
    CONSTRAINT [PK_dbo.Units] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[CustomProperties] (
    [Id] [int] NOT NULL IDENTITY,
    [Name] [nvarchar](max) NOT NULL,
    [CustomPropertyType] [int] NOT NULL,
    [Unit_Id] [int] NOT NULL,
    CONSTRAINT [PK_dbo.CustomProperties] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[CustomPropertyValues] (
    [Id] [int] NOT NULL IDENTITY,
    [SerializedValue] [nvarchar](max),
    [ReportDetailsId] [int],
    [CustomProperty_Id] [int],
    CONSTRAINT [PK_dbo.CustomPropertyValues] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[ReportDetails] (
    [Id] [int] NOT NULL IDENTITY,
    CONSTRAINT [PK_dbo.ReportDetails] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Notifications] (
    [Id] [int] NOT NULL IDENTITY,
    [SenderId] [nvarchar](128),
    [TargetId] [nvarchar](128),
    [Content] [nvarchar](max),
    [Type] [int] NOT NULL,
    [ParameterId] [nvarchar](max),
    [Timestamp] [datetime2] NOT NULL,
    CONSTRAINT [PK_dbo.Notifications] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] [nvarchar](128) NOT NULL,
    [RoleId] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId])
)
CREATE TABLE [dbo].[AspNetRoles] (
    [Id] [nvarchar](128) NOT NULL,
    [Name] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY ([Id])
)
CREATE TABLE [dbo].[Units2Clients] (
    [UnitId] [int] NOT NULL,
    [ClientId] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.Units2Clients] PRIMARY KEY ([UnitId], [ClientId])
)
CREATE INDEX [IX_ReportId] ON [dbo].[Assignments]([ReportId])
CREATE INDEX [IX_TargetId] ON [dbo].[Assignments]([TargetId])
CREATE INDEX [IX_AdminId] ON [dbo].[Assignments]([AdminId])
CREATE INDEX [IX_ProfilePhotoId] ON [dbo].[AspNetUsers]([ProfilePhotoId])
CREATE UNIQUE INDEX [UserNameIndex] ON [dbo].[AspNetUsers]([UserName])
CREATE INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]([UserId])
CREATE INDEX [IX_ApplicationUser_Id] ON [dbo].[Locations]([ApplicationUser_Id])
CREATE INDEX [IX_Unit_Id] ON [dbo].[Locations]([Unit_Id])
CREATE INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]([UserId])
CREATE INDEX [IX_ReportId] ON [dbo].[Resources]([ReportId])
CREATE INDEX [IX_MessageId] ON [dbo].[Resources]([MessageId])
CREATE INDEX [IX_SenderId] ON [dbo].[Messages]([SenderId])
CREATE INDEX [IX_TargetId] ON [dbo].[Messages]([TargetId])
CREATE INDEX [IX_CreatorId] ON [dbo].[Reports]([CreatorId])
CREATE INDEX [IX_LocationId] ON [dbo].[Reports]([LocationId])
CREATE INDEX [IX_CategoryId] ON [dbo].[Reports]([CategoryId])
CREATE INDEX [IX_DetailsId] ON [dbo].[Reports]([DetailsId])
CREATE INDEX [IX_Unit_Id] ON [dbo].[Reports]([Unit_Id])
CREATE INDEX [IX_Unit_Id] ON [dbo].[Categories]([Unit_Id])
CREATE INDEX [IX_AdministratorId] ON [dbo].[Units]([AdministratorId])
CREATE INDEX [IX_Unit_Id] ON [dbo].[CustomProperties]([Unit_Id])
CREATE INDEX [IX_ReportDetailsId] ON [dbo].[CustomPropertyValues]([ReportDetailsId])
CREATE INDEX [IX_CustomProperty_Id] ON [dbo].[CustomPropertyValues]([CustomProperty_Id])
CREATE INDEX [IX_SenderId] ON [dbo].[Notifications]([SenderId])
CREATE INDEX [IX_TargetId] ON [dbo].[Notifications]([TargetId])
CREATE INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]([UserId])
CREATE INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]([RoleId])
CREATE UNIQUE INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]([Name])
CREATE INDEX [IX_UnitId] ON [dbo].[Units2Clients]([UnitId])
CREATE INDEX [IX_ClientId] ON [dbo].[Units2Clients]([ClientId])
ALTER TABLE [dbo].[Assignments] ADD CONSTRAINT [FK_dbo.Assignments_dbo.AspNetUsers_AdminId] FOREIGN KEY ([AdminId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[Assignments] ADD CONSTRAINT [FK_dbo.Assignments_dbo.Reports_ReportId] FOREIGN KEY ([ReportId]) REFERENCES [dbo].[Reports] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Assignments] ADD CONSTRAINT [FK_dbo.Assignments_dbo.AspNetUsers_TargetId] FOREIGN KEY ([TargetId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[AspNetUsers] ADD CONSTRAINT [FK_dbo.AspNetUsers_dbo.Resources_ProfilePhotoId] FOREIGN KEY ([ProfilePhotoId]) REFERENCES [dbo].[Resources] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[AspNetUserClaims] ADD CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Locations] ADD CONSTRAINT [FK_dbo.Locations_dbo.AspNetUsers_ApplicationUser_Id] FOREIGN KEY ([ApplicationUser_Id]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Locations] ADD CONSTRAINT [FK_dbo.Locations_dbo.Units_Unit_Id] FOREIGN KEY ([Unit_Id]) REFERENCES [dbo].[Units] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[AspNetUserLogins] ADD CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Resources] ADD CONSTRAINT [FK_dbo.Resources_dbo.Messages_MessageId] FOREIGN KEY ([MessageId]) REFERENCES [dbo].[Messages] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Resources] ADD CONSTRAINT [FK_dbo.Resources_dbo.Reports_ReportId] FOREIGN KEY ([ReportId]) REFERENCES [dbo].[Reports] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [FK_dbo.Messages_dbo.AspNetUsers_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [FK_dbo.Messages_dbo.AspNetUsers_TargetId] FOREIGN KEY ([TargetId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[Reports] ADD CONSTRAINT [FK_dbo.Reports_dbo.Units_Unit_Id] FOREIGN KEY ([Unit_Id]) REFERENCES [dbo].[Units] ([Id])
ALTER TABLE [dbo].[Reports] ADD CONSTRAINT [FK_dbo.Reports_dbo.Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories] ([Id])
ALTER TABLE [dbo].[Reports] ADD CONSTRAINT [FK_dbo.Reports_dbo.AspNetUsers_CreatorId] FOREIGN KEY ([CreatorId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[Reports] ADD CONSTRAINT [FK_dbo.Reports_dbo.ReportDetails_DetailsId] FOREIGN KEY ([DetailsId]) REFERENCES [dbo].[ReportDetails] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Reports] ADD CONSTRAINT [FK_dbo.Reports_dbo.Locations_LocationId] FOREIGN KEY ([LocationId]) REFERENCES [dbo].[Locations] ([Id])
ALTER TABLE [dbo].[Categories] ADD CONSTRAINT [FK_dbo.Categories_dbo.Units_Unit_Id] FOREIGN KEY ([Unit_Id]) REFERENCES [dbo].[Units] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Units] ADD CONSTRAINT [FK_dbo.Units_dbo.AspNetUsers_AdministratorId] FOREIGN KEY ([AdministratorId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[CustomProperties] ADD CONSTRAINT [FK_dbo.CustomProperties_dbo.Units_Unit_Id] FOREIGN KEY ([Unit_Id]) REFERENCES [dbo].[Units] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[CustomPropertyValues] ADD CONSTRAINT [FK_dbo.CustomPropertyValues_dbo.ReportDetails_ReportDetailsId] FOREIGN KEY ([ReportDetailsId]) REFERENCES [dbo].[ReportDetails] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[CustomPropertyValues] ADD CONSTRAINT [FK_dbo.CustomPropertyValues_dbo.CustomProperties_CustomProperty_Id] FOREIGN KEY ([CustomProperty_Id]) REFERENCES [dbo].[CustomProperties] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [FK_dbo.Notifications_dbo.AspNetUsers_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [FK_dbo.Notifications_dbo.AspNetUsers_TargetId] FOREIGN KEY ([TargetId]) REFERENCES [dbo].[AspNetUsers] ([Id])
ALTER TABLE [dbo].[AspNetUserRoles] ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[AspNetUserRoles] ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Units2Clients] ADD CONSTRAINT [FK_dbo.Units2Clients_dbo.Units_UnitId] FOREIGN KEY ([UnitId]) REFERENCES [dbo].[Units] ([Id]) ON DELETE CASCADE
ALTER TABLE [dbo].[Units2Clients] ADD CONSTRAINT [FK_dbo.Units2Clients_dbo.AspNetUsers_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
CREATE TABLE [dbo].[__MigrationHistory] (
    [MigrationId] [nvarchar](128) NOT NULL,
    [ContextKey] [nvarchar](256) NOT NULL,
    [Model] [varbinary](max) NOT NULL,
    [ProductVersion] [nvarchar](32) NOT NULL,
    CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY ([MigrationId], [ContextKey])
)