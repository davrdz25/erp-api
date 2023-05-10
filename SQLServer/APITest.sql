CREATE DATABASE CRM_DATABASE COLLATE Latin1_General_CS_AS
USE CRM_DATABASE

/*IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Users' )
BEGIN
    CREATE TABLE Users
    (
        UserEntry INT NOT NULL,
        UserCode VARCHAR(20) NOT NULL,
        UserName VARCHAR(100) NOT NULL,
        Remarks VARCHAR(200),
        GroupEntry INT NOT NULL CONSTRAINT DF_Users_GroupEntry DEFAULT -1,
        RoleEntry INT NOT NULL CONSTRAINT DF_Users_RoleEntry DEFAULT -1,
        EmployeeEntry INT NOT NULL CONSTRAINT DF_USers_EmployeeEntry DEFAULT -1,
        MobilePhone VARCHAR(20),
        Email VARCHAR (100),
        isLocked CHAR NOT NULL CONSTRAINT DF_Users_isLocked DEFAULT 'N',
        isActive CHAR NOT NULL CONSTRAINT DF_Users_isActive DEFAULT 'Y',
        isLoggedIn CHAR NOT NULL CONSTRAINT DF_Users_isLoggedIn DEFAULT 'N',
        PasswordHash BINARY(64) NOT NULL,
        Salt UNIQUEIDENTIFIER NOT NULL,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        UserSign INT NOT NULL CONSTRAINT DF_Users_UserSign DEFAULT -1,
        CONSTRAINT PK_Users_UserEntry PRIMARY KEY (UserEntry),
        CONSTRAINT CHK_Users_UserEntry CHECK (UserEntry >= 1),
        CONSTRAINT UQ_Users_Code UNIQUE (UserCode),
        CONSTRAINT UQ_Users_Name UNIQUE (UserName),
        CONSTRAINT UQ_Users_CodeName UNIQUE(UserCode, UserName),
        CONSTRAINT CHK_Users_GroupNum CHECK (GroupEntry >= -1 AND GroupEntry <> 0),
        CONSTRAINT CHK_Users_EmployeeNum CHECK (EmployeeEntry >= -1),
        CONSTRAINT CHK_Users_Locked CHECK (isLocked IN ('Y','N')),
        CONSTRAINT CHK_Users_Active CHECK (isActive IN ('Y','N')),
        CONSTRAINT CHK_Users_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 ),
        CONSTRAINT CHK_Users_LoggedIn CHECK (isLoggedIn IN ('Y','N')),
    );
END
--INSERT INTO Users (ID, UserEntry, UserCode ,UserName,  PasswordHash, Salt, CreateDate, UserSign)
--VALUES(1,1,'sys_admin', 'Sytem Administrator', HASHBYTES('SHA2_512', 'rdx600rew..Z$zXLHN8!X2zYsgK7uT&YXU9(YoMRFTTyNAWRQdQ7Njiik7zomrrJ8RE$frWDEeB' + CONVERT(NVARCHAR(36),CONVERT(uniqueidentifier, '1a9945a7-f82b-4aaa-81be-f5135e428a56'))),CONVERT(uniqueidentifier,'1a9945a7-f82b-4aaa-81be-f5135e428a56'),GETDATE(),-1)
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'UserGroups' )
BEGIN
    CREATE TABLE UserGroups
    (
        GroupEntry INT NOT NULL,
        GroupCode NVARCHAR(20) NOT NULL,
        GroupName NVARCHAR(100) NOT NULL,
        Remarks NVARCHAR(200),
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        UserSign INT NOT NULL CONSTRAINT DF_UserGroups_UserSign DEFAULT -1,
        CONSTRAINT PK_UserGroups_GroupEntry PRIMARY KEY (GroupEntry),
        CONSTRAINT CHK_UserGroup_GroupEntry CHECK(GroupEntry >= 1),
        CONSTRAINT UQ_Groups_Code UNIQUE(GroupCode),
        CONSTRAINT UQ_Groups_Name UNIQUE(GroupName),
        CONSTRAINT UQ_Groups_CodeName UNIQUE (GroupCode, GroupName),
        CONSTRAINT CHK_Groups_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Permissions' )
BEGIN
    CREATE TABLE Permissions
    (
        PermEntry INT NOT NULL,
        PermName NVARCHAR(20) NOT NULL,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME ,
        UserSign INT NOT NULL CONSTRAINT DF_Permissions_UserSign DEFAULT -1,
        CONSTRAINT PK_Permissions_PermEntry PRIMARY KEY (PermEntry),
        CONSTRAINT CHK_Permissions_PermEntry CHECK(PermEntry >= 1),
        CONSTRAINT UQ_Permissions_Name UNIQUE (PermName),
        CONSTRAINT CHK_Permissions_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'UserPermissions' )
BEGIN
    CREATE TABLE UserPermissions
    (
        UPermEntry INT NOT NULL,
        UserEntry INT NOT NULL,
        PermEntry INT NOT NULL,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME ,
        UserSign INT NOT NULL CONSTRAINT DF_UserPermissions_UsserSign DEFAULT -1,
        CONSTRAINT PK_UserPermissions_ID PRIMARY KEY (UPermEntry),
        CONSTRAINT UQ_UserPermissions_UserPerm UNIQUE (UserEntry, PermEntry),
        CONSTRAINT CHK_UserPermissions_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Roles' )
BEGIN
    CREATE TABLE Roles
    (
        RoleEntry INT,
        RoleCode NVARCHAR(20) NOT NULL,
        RoleName NVARCHAR(199) NOT NULL,
        Remarks NVARCHAR(200),
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        UserSign INT NOT NULL CONSTRAINT DF_Roles_UserSign DEFAULT -1,
        CONSTRAINT PK_Roles_ID PRIMARY KEY (RoleEntry),
        CONSTRAINT UQ_Roles_Code UNIQUE (RoleCode),
        CONSTRAINT UQ_Roles_Name UNIQUE (RoleName),
        CONSTRAINT UQ_Roles_CodeName UNIQUE(RoleCode, RoleName),
        CONSTRAINT CHK_Roles_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'RoleDetails' )
BEGIN
    CREATE TABLE RoleDetails
    (
        RDEntry INT,
        RoleEntry INT NOT NULL,
        PermEntry INT NOT NULL,
        Active CHAR NOT NULL CONSTRAINT DF_RoleDetails_Active DEFAULT 'N',
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        UserSign INT NOT NULL CONSTRAINT DF_RoleDetails_UserSign DEFAULT -1,
        CONSTRAINT PK_RoleDetails_ID PRIMARY KEY (RDEntry),
        CONSTRAINT UQ_RoleDetails_RolePerm UNIQUE (RoleEntry, PermEntry),
        CONSTRAINT CHK_RoleDetail_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Employees' )
BEGIN
    CREATE TABLE Employees
    (
        ID INT,
        FirstName NVARCHAR(50) NOT NULL,
        MiddleName NVARCHAR(50),
        SurName NVARCHAR (50) NOT NULL,
        LastName NVARCHAR(50),
        BornDate DATE NOT NULL,
        Gender CHAR NOT NULL,
        FederalTaxID NVARCHAR(50),
        SInsuranceNumber NVARCHAR(50),
        CURP NVARCHAR(100),
        HomePhone NVARCHAR(20) NOT NULL,
        CellPhone NVARCHAR(20) NOT NULL,
        CellPhone2 NVARCHAR(20),
        Email NVARCHAR(50) NOT NULL,
        Marital CHAR,
        Children INT,
        Passport NVARCHAR(50),
        Picture NVARCHAR(254),
        StartDate DATE,
        TerminationDate DATE,
        TerminationReason VARCHAR(254),
        Salary DECIMAL(19,6),
        SalaryUnit CHAR,
        Area INT NOT NULL,
        Team INT NOT NULL,
        Active CHAR CONSTRAINT DF_Emmployees_Active DEFAULT 'Y',
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        UserSign INT NOT NULL CONSTRAINT DF_Employees_Userign DEFAULT -1,
        CONSTRAINT PK_Employees_ID PRIMARY KEY(ID),
        CONSTRAINT UQ_Employees_FullName UNIQUE (FirstName, MiddleName),
        CONSTRAINT UQ_Employees_Phone UNIQUE (HomePhone),
        CONSTRAINT UQ_Employees_Email UNIQUE (Email),
        CONSTRAINT UQ_Employees_FederalTaxID UNIQUE (FederalTaxID),
        CONSTRAINT CHK_Employees_Gender CHECK (Gender IN ('M','F')),
        CONSTRAINT CHK_Employees_UserSign CHECK (UserSign <> 0 AND UserSign >= -1)
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'EmployeeAreas' )
BEGIN
    CREATE TABLE EmployeeAreas
    (
        ID INT,
        AreaCode NVARCHAR(20),
        AreaName NVARCHAR(100),
        Remarks NVARCHAR(200),
        UserSign INT NOT NULL CONSTRAINT DF_EmplyeeAreas_UserSign DEFAULT -1,
        CONSTRAINT PK_EmployeeAreas_ID PRIMARY KEY (ID),
        CONSTRAINT UQ_EmployeeAreas_Code UNIQUE (AreaCode),
        CONSTRAINT UQ_EmployeeAreas_Name UNIQUE (AreaName),
        CONSTRAINT UQ_EmployeeAreas_CodeName UNIQUE (AreaCode, AreaName),
        CONSTRAINT CHK_EmployeeArea_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'EmployeeTeams' )
BEGIN
    CREATE TABLE EmployeeTeams
    (
        ID INT,
        TeamCode NVARCHAR(20),
        TeamName NVARCHAR(100),
        Remarks NVARCHAR(200),
        UserSign INT NOT NULL CONSTRAINT DF_EmployeeTeams_UserSign DEFAULT -1,
        CONSTRAINT PK_EmployeeTeams_ID PRIMARY KEY (ID),
        CONSTRAINT UQ_EmployeeTeams_Code UNIQUE (TeamCode),
        CONSTRAINT UQ_EmployeeTeams_Name UNIQUE (TeamName),
        CONSTRAINT UQ_EmployeeTeams_CodeName UNIQUE (TeamCode, TeamName),
        CONSTRAINT CHK_EmployeeTeams_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'AreaMembers' )
BEGIN
    CREATE TABLE AreaMembers
    (
        ID INT,
        AreaID INT NOT NULL,
        EmployeeID INT NOT NULL,
        AreaRole CHAR(1) NOT NULL CONSTRAINT DF_AreaMembers_AreaRole DEFAULT 'M',
        UserSign INT NOT NULL CONSTRAINT DF_AreaMembers_UserSign DEFAULT -1,
        CONSTRAINT PK_AreaMembers_ID PRIMARY KEY (ID),
        CONSTRAINT UQ_AreaMembers_Employee UNIQUE (EmployeeID),
        CONSTRAINT CHK_AreaMember_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    );
END;
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'TeamMembers' )
BEGIN
    CREATE TABLE TeamMembers
    (
        ID INT,
        TeamID INT NOT NULL,
        EmployeeID INT NOT NULL,
        AreaID INT NOT NULL,
        TeamRole CHAR(1) NOT NULL CONSTRAINT DF_TeamMembers_TeamRole DEFAULT 'M',
        UserSign INT NOT NULL CONSTRAINT DF_TeamMembers_UserSign DEFAULT -1,
        CONSTRAINT PK_TeamMembers_ID PRIMARY KEY (ID),
        CONSTRAINT UQ_TeamMembers_Employee UNIQUE (EmployeeID),
        CONSTRAINT CHK_TeamMembers_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    )
END
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'EndReasons' )
BEGIN
    CREATE TABLE EndReasons
    (
        ID INT,
        ReasonName INT NOT NULL,
        Remarks INT NOT NULL,
        UserSign INT NOT NULL CONSTRAINT DF_EndReasons_UserSign DEFAULT -1,
        CONSTRAINT PK_EndReasons_ID PRIMARY KEY (ID),
        CONSTRAINT UQ_EndReasons_Name UNIQUE (ReasonName),
        CONSTRAINT CHK_EndReasons_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    )
    END
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'RegEntranceExit' )
BEGIN
    CREATE TABLE RegEntranceExits
    (
        ID INT,
        EmployeeID INT NOT NULL,
        RegDate DATE NOT NULL,
        RegTime TIME NOT NULL,
        Direction CHAR NOT NULL CONSTRAINT DF_RegEntranceExits_Direction DEFAULT 'E',
        CONSTRAINT PK_RegEntranceExits_ID PRIMARY KEY (ID),
        CONSTRAINT CHK_RegEntranceExits_Direccion CHECK(Direction IN ('E', 'X'))
    )
END
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'SessionHistory' )
BEGIN
    CREATE TABLE SessionHistory
    (
        SessionEntry INT,
        SessionUUID UNIQUEIDENTIFIER NOT NULL,
        UserEntry INT NOT NULL,
        UserCode NVARCHAR(20),
        Email NVARCHAR(50),
        LoginDate DATETIME NOT NULL,
        LogOutDate DATETIME,
        CONSTRAINT PK_SessionHistory_ID PRIMARY KEY (SessionEntry),
        CONSTRAINT CHK_SessionHistory_UserEmail CHECK (ISNULL(UserCode,'') <> '' OR ISNULL(Email,'') <> '')
    )
END
GO
IF NOT  EXISTS(SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Countries' )
BEGIN
    CREATE TABLE Countries
    (
        CryEntry INT,
        CryName NVARCHAR(200) NOT NULL,
        Alpha2Code CHAR(2),
        Alpha3Code CHAR(3),
        NumCode CHAR(3),
        Currency INT,
        UserSign INT NOT NULL CONSTRAINT DF_Countries_UserSign DEFAULT  -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_Countries_Entry PRIMARY KEY (CryEntry),
        CONSTRAINT UQ_Countries_Name UNIQUE (CryName),
        CONSTRAINT CHK_Countries_Alpha2Code CHECK(LEN(Alpha2Code) = 2),
        CONSTRAINT CHK_Countries_Alpha3Code CHECK(LEN(Alpha3Code) = 3),
        CONSTRAINT CHK_Countries_NameAlpha2Code UNIQUE (CryName,Alpha2Code),
        CONSTRAINT CHK_Countries_NameAlpha3Code UNIQUE (CryName, Alpha3Code),
        CONSTRAINT CHK_Countries_NameNumCode UNIQUE (CryName, NumCode),
        CONSTRAINT CHK_Countries_AlphaCodes UNIQUE (Alpha2Code, Alpha3Code),
        CONSTRAINT CHK_Countries_Alpha2NumCode UNIQUE (Alpha2Code, NumCode),
        CONSTRAINT CHK_Countries_Alpha3NumCode UNIQUE (Alpha3Code, NumCode),
        CONSTRAINT CHK_Countries_NumCode CHECK(LEN(NumCode) = 3),
        CONSTRAINT CHK_Countries_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    )
END
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'BusinessPartners' )
BEGIN
    CREATE TABLE BusinessPartners
    (
        BPEntry INT NOT NULL,
        BPCode NVARCHAR(20) NOT NULL,
        BPFirstName NVARCHAR(50) NOT NULL,
        BPScndName NVARCHAR(50) ,
        BPSurName NVARCHAR(50) NOT NULL,
        BPLastName NVARCHAR(50),
        BPLictTradNum NVARCHAR(20),
        Email1 NVARCHAR(50),
        Email2 NVARCHAR(50),
        Phone1 NVARCHAR(20),
        Phone2 NVARCHAR(20),
        UserSign INT NOT NULL CONSTRAINT DF_BusinessPartnerss_UserSign DEFAULT -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_BusinessPartners_Entry PRIMARY KEY (BPEntry),
        CONSTRAINT UQ_BusinessPartners_Code UNIQUE (BPCode),
        CONSTRAINT UQ_BusinessPartners_FrstSurName UNIQUE (BPFirstName, BPSurName),
        CONSTRAINT UQ_BusinessPartners_Phone1 UNIQUE (Phone1),
        CONSTRAINT UQ_BusinessPartners_Phone2 UNIQUE (Phone2),
        CONSTRAINT UQ_BusinessPartners_Email1 UNIQUE (Email1),
        CONSTRAINT UQ_BusinessPartners_Email2 UNIQUE (Email2),
        CONSTRAINT UQ_BusinessPartners_Phones UNIQUE (Phone1, Phone2),
        CONSTRAINT UQ_BusinessPartners_Emails UNIQUE (Email1, Email2),
        CONSTRAINT CHK_BusinessPartners_UserSign CHECK(UserSign <> 0 AND UserSign >= -1)
    );
END;
GO
*/

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'QRCodes')
BEGIN
    CREATE TABLE QRCodes 
    (
        "Entry" INT,
        "Name" NVARCHAR NOT NULL,
        "Data" NTEXT NOT NULL,
        "ImagePath" NVARCHAR NOT NULL,
        UserSign INT NOT NULL CONSTRAINT DF_QRCodes_UserSign DEFAULT -1,
        CreateDate DATE NOT NULL,
        UpdateDate DATE,
        CONSTRAINT PK_QRCodes_Entry PRIMARY KEY ("Entry"),
        CONSTRAINT UQ_QRCodes_Name UNIQUE ("Name"),
        CONSTRAINT CHK_QRCodes_UserSign CHECK (UserSign >= 0 AND UserSign <> 0)
    )
END
GO
IF NOT  EXISTS(SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Accounts' )
BEGIN
    CREATE TABLE Accounts
    (
        "Entry" INT,
        "Code" NVARCHAR(20),
        "Name" NVARCHAR(100),
        "Level" SMALLINT NOT NULL,
        "Type" SMALLINT NOT NULL CONSTRAINT DF_Accounts_Type DEFAULT -1, 
        PostableAcct CHAR(1) NOT NULL CONSTRAINT DF_Accounts_Postable DEFAULT 'Y', 
        FatherEntry INT NOT NULL,
        Balance DECIMAL(19,6),
        UserSign INT NOT NULL CONSTRAINT DF_Accounts_UserSign DEFAULT -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_Accounts_Entry PRIMARY KEY ("Entry"),
        CONSTRAINT UQ_Accounts_Code UNIQUE ("Code"),
        CONSTRAINT UQ_Accounts_Name UNIQUE ("Name"),
        CONSTRAINT UQ_Accounts_CodeName UNIQUE ("Code", "Name"),
        CONSTRAINT CHK_Accounts_Level CHECK ("Level" BETWEEN 1 AND 10),
        CONSTRAINT CHK_Accounts_PstblAccount CHECk (PostableAcct IN ('Y', 'N')),
        CONSTRAINT CHK_Accounts_Type CHECK ("Type" <> 0 AND "Type" <> 0),
        CONSTRAINT CHK_Accounts_UsrSign CHECK(UserSign <> 0 AND UserSign >= -1)
    )
END
GO
IF NOT  EXISTS(SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Banks' )
BEGIN
    CREATE TABLE Banks
    (
        "Entry" INT,
        ShortName NVARCHAR(100) NOT NULL,
        BussinesName NVARCHAR(254),
        SWIFTBIC NVARCHAR(20),
        AcctEntry INT NOT NULL CONSTRAINT DF_Banks_Account DEFAULT -1,
        UserSign INT NOT NULL CONSTRAINT DF_Banks_UserSign DEFAULT  -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_Banks_Entry PRIMARY KEY ("Entry"),
        CONSTRAINT UQ_Banks_ShrtName UNIQUE  (ShortName),
        CONSTRAINT CHK_Banks_UserSign CHECK (UserSign >= -1 AND UserSign <> 0 )
    )
END
GO
IF NOT  EXISTS(SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'BankAccounts' )
BEGIN
    CREATE TABLE BankAccounts
    (
        "Entry" INT,
        "Name" NVARCHAR(100) NOT NULL,
        BankEntry INT NOT NULL,
        AcctEntry INT NOT NULL CONSTRAINT DF_BankAccounts_Account DEFAULT -1,
        SWIFTBIC NVARCHAR(20),
        Credit BIT CONSTRAINT DF_BankAccounts_Credit DEFAULT 0,
        CreditLimit DECIMAL(19,6) CONSTRAINT DF_BankAccounts_CreditLimit DEFAULT 0,
        CreditDebt DECIMAL(19,6),
        AviableCredit DECIMAL(19,6),
        CutOffDay INT,
        PayDayLimit INT,
        DebitBalance DECIMAL (19,6),
        UsrSign INT NOT NULL CONSTRAINT DF_BankAccounts_UserSign DEFAULT  -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_BankAccounts_BankAcctEntry PRIMARY KEY ("Entry"),
        CONSTRAINT UQ_BankAccounts_BankAcctName UNIQUE ("Name"),
        CONSTRAINT CHK_BankAccounts_Bank CHECK (BankEntry <> 0 AND BankEntry >= -1),
        CONSTRAINT CHK_BankAccounts_CutOffDay CHECK (CutOffDay BETWEEN 1 AND 31),
        CONSTRAINT CHK_BankAccounts_PayDayLimit CHECK (CutOffDay BETWEEN 1 AND 31),
    )
END
GO
IF NOT  EXISTS(SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Cards' )
BEGIN
    CREATE TABLE Cards
    (
        "Entry" INT,
        "Number" NVARCHAR(4) NOT NULL,
        ValidFromMonth INT NOT NULL,
        ValidFromYear INT NOT NULL,
        ValidUntilMonth INT NOT NULL,
        ValidUntilYear INT NOT NULL,
        Digital CHAR NOT NULL CONSTRAINT DF_Cards_Digital DEFAULT 'N',
        Credit CHAR NOT NULL CONSTRAINT DF_Cards_Credit DEFAULT 'N',
        AcctEntry INT NOT NULL,
        BankEntry INT NOT NULL,
        UserSign INT NOT NULL CONSTRAINT DF_Cards_UserSign DEFAULT  -1,
        CreateDate DATETIME NOT NULL,
        UpdateDate DATETIME,
        CONSTRAINT PK_Cards_CardEntry PRIMARY KEY ("Entry"),
        CONSTRAINT UQ_Cards_CardNumber UNIQUE ("Number"),
        CONSTRAINT CHK_Cards_AcctEntry CHECK (AcctEntry <> 0 AND AcctEntry >= -1),
        CONSTRAINT CHK_Cards_BankEntry CHECK (BankEntry <> 0 AND BankEntry >= -1),
        CONSTRAINT CHK_Cards_ValidFromMonth CHECK (ValidFromMonth BETWEEN 1 AND 12),
        CONSTRAINT CHK_Cards_ValidFromYear CHECK (ValidFromYear BETWEEN 0 AND 99),
        CONSTRAINT CHK_Cards_ValidUntilMonth CHECK (ValidUntilMonth BETWEEN 0 AND 99),
        CONSTRAINT CHK_Cards_ValidUntilYear CHECK (ValidUntilYear BETWEEN 0 AND 99)
    )
END
GO
CREATE PROCEDURE CreateAccount
    @Name NVARCHAR(MAX),
    @Level INT = -1,
    @Father INT = -1,
    @Type INT = -1,
    @Balance DECIMAL(19,6) = 0,
    @Postable CHAR = 'N',
    @CreateDate DATETIME
AS
    DECLARE @Code NVARCHAR(18)
    DECLARE @Sequential INT
    DECLARE @BaseCode NVARCHAR(18)
    DECLARE @Prefix  NVARCHAR(18)
    DECLARE @LPrefix NVARCHAR(18)

    BEGIN TRY
        IF (LEN(@Name) = 0 OR @Name = '') BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Name cannot be empty' AS 'Message';
            RETURN
        END

        IF (LEN(@Name) > 100) BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Name cannot be greather than 100 characters' AS 'Message';
            RETURN
        END

        IF(@Type = -1 AND @Postable = 'Y') BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Invalid type if account is postable' AS 'Message';
            RETURN
        END

        IF (@Father = 0 OR @Father < -1) BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Invalid value father' AS 'Message';
            RETURN
        END

        IF (@Father = -1 AND @Level > 1) BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Invalid value father if account level is greater than 1' AS 'Message';
            RETURN
        END

        IF EXISTS(SELECT "Name" FROM "Accounts" WHERE "Name" = @Name) BEGIN
            SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Name already exists' AS 'Message';  
            RETURN 
        END

        IF @Level = 1 BEGIN
            SELECT @Sequential = CASE COUNT(*) WHEN 0 THEN 1 ELSE COUNT(*) + 1 END FROM "Accounts" WHERE "Level" = 1
    
            SET @Code = CONCAT(@Prefix,CONVERT(NVARCHAR(3),FORMAT(@Sequential,'D3')),REPLICATE('0',18-@level*3))

            INSERT INTO Accounts ("Entry", "Code", "Name", "Level", FatherEntry, "Type", PostableAcct, Balance, UserSign, CreateDate ) 
            VALUES ((SELECT ISNULL(MAX("Entry"), 0) + 1 "Entry" FROM Accounts), @Code, @Name, @Level, @Father, @Type, @Postable, NULL, -1, @CreateDate)

            SELECT  200 AS 'Number',0 AS Severity,'S' AS 'State','CreateAccount' AS 'Procedure',0 AS 'Line', 'Account Created' AS 'Message';
            RETURN
        END
        ELSE BEGIN 
            DECLARE @FatherCode NVARCHAR(18)

            IF NOT EXISTS(SELECT "Code" FROM "Accounts" WHERE "Entry" = @Father AND "Level" = @Level -1) BEGIN
                SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Father doesn''t exists' AS 'Message'; 
                RETURN
            END

            SELECT @FatherCode = "Code" FROM "Accounts" WHERE "Entry" = @Father AND "Level" = @Level - 1
            SET @Prefix = SUBSTRING(@FatherCode,1,(@Level*3)-3)
            SET @LPrefix = SUBSTRING(@FatherCode,1,(@Level*3))

            SELECT @Sequential = CASE COUNT(*) WHEN 0 THEN 1 ELSE COUNT(*) + 1 END FROM "Accounts" WHERE Level = @Level  AND FatherEntry = @Father

            SET @Code = CONCAT(@Prefix,CONVERT(NVARCHAR(3),FORMAT(@Sequential,'D3')),REPLICATE('0',18-@level*3))
       
            INSERT INTO Accounts ("Entry", "Code", "Name", "Level", FatherEntry, "Type", PostableAcct, Balance, UserSign, CreateDate ) 
            VALUES ((SELECT ISNULL(MAX("Entry"), 0) + 1 "Entry" FROM Accounts), @Code, @Name, @Level, @Father, @Type, @Postable, @Balance, -1, @CreateDate)

            SELECT  200 AS 'Number',0 AS Severity,'S' AS 'State','CreateAccount' AS 'Procedure',0 AS 'Line', 'Account Created' AS 'Message'; 
            RETURN
        END
    END TRY
        
    BEGIN CATCH
        SELECT  500 AS 'Number',ERROR_PROCEDURE() AS 'Procedure',ERROR_STATE() as 'State', ERROR_MESSAGE() AS 'Message';
        THROW
    END CATCH
GO

CREATE PROCEDURE CreateBankAccount
    @Name NVARCHAR(100),
    @BankEntry INT = -1,
    @AcctEntry INT = -1,
    @SWIFTBIC NVARCHAR(20) = NULL,
    @Debit CHAR = 'Y',
    @Credit CHAR = 'N',
    @CreditLimit DECIMAL(19,6) = 0,
    @DebitBalance INT = 0,
    @CreditDebt INT = 0,
    @AviableCredit INT = 0,
    @CutOffDay INT = -1,
    @PayDayLimit INT = -1,
    @UserSign INT = -1,
    @CreateDate DATETIME
AS
    BEGIN TRY
        IF(LEN(@Name) = 0 OR @Name = '' OR @Name IS NULL)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Invalid name' AS 'Message'; 
            RETURN
        END

        IF((@BankEntry = 0 OR @BankEntry < -1))
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Invalid bank entry' AS 'Message'; 
            RETURN
        END

        IF((@AcctEntry = 0 OR @AcctEntry < -1))
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Invalid account entry' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'Y' AND @DebitBalance <> 0)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No debit balance if account is credit' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'Y' AND (@PayDayLimit < 1 AND @PayDayLimit > 31))
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Invalid Pay day limit if account is credit' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'Y' AND (@CutOffDay < 1 AND @CutOffDay > 31))
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Invalid cut off day if account is credit' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'Y' AND @CutOffDay <> -1)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No cut off day on debit account' AS 'Message'; 
            RETURN
        END
        

        IF(@Credit = 'N' AND @PayDayLimit <> -1)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No pay day limit on debit account' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'N' AND @CreditLimit <> 0)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No credit debt on debit account' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'N' AND @CreditDebt <> 0)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No credit debt on debit account' AS 'Message'; 
            RETURN
        END

        IF(@Credit = 'N' AND @AviableCredit <> 0)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','No aviable credit on debit account' AS 'Message'; 
            RETURN
        END

        IF EXISTS(SELECT "Name" FROM "BankAccounts" WHERE "Name" = @Name)
        BEGIN
            SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Name already exists' AS 'Message'; 
            RETURN
        END
        
        IF (@AcctEntry <> -1)
        BEGIN
            IF NOT EXISTS(SELECT "Entry" FROM "Banks" WHERE "Entry" = @BankEntry)
            BEGIN
                SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Bank doesn''t exists' AS 'Message'; 
                RETURN
            END
        END
        
        IF (@SWIFTBIC IS NOT NULL) BEGIN
            IF EXISTS(SELECT "SWIFTBIC" FROM "Banks" WHERE "SWIFTBIC" = @SWIFTBIC)
            BEGIN
                SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','SWIFTBIC already exists' AS 'Message'; 
                RETURN
            END
        END

        IF (@AcctEntry <> -1) BEGIN
            IF NOT EXISTS(SELECT "Entry" FROM "Accounts" WHERE "Entry" = @AcctEntry)
            BEGIN
                SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Account doesn''t exists' AS 'Message'; 
                RETURN
            END
        END

        IF (@BankEntry <> -1) BEGIN
            IF NOT EXISTS(SELECT "Entry" FROM "Banks" WHERE "Entry" = @BankEntry)
            BEGIN
                SELECT 500 AS 'Number','BankAccount' AS 'Procedure','F' AS 'State','Bank doesn''t exists' AS 'Message'; 
                RETURN
            END
        END

        INSERT INTO "BankAccounts" ("Entry", "Name", "BankEntry", "SWIFTBIC", "AcctEntry", "Credit", "DebitBalance", "CreditLimit", "CreditDebt", "AviableCredit", "CutOffDay", "PayDayLimit", "UsrSign", "CreateDate")
        VALUES ((SELECT ISNULL(MAX("Entry"), 0) + 1 "Entry" FROM "BankAccounts"), @Name, @BankEntry, @SWIFTBIC, @AcctEntry, @Credit, @CreditLimit, @DebitBalance, @CreditDebt, @AviableCredit, @CutOffDay, @PayDayLimit, -1, GETDATE())

        SELECT  200 AS 'Number',0 AS Severity,'S' AS 'State','CreateBankAccount' AS 'Procedure',0 AS 'Line', 'BankAccount Created' AS 'Message';
        RETURN
    END TRY
    BEGIN CATCH
        SELECT  500 AS 'Number',ERROR_PROCEDURE() AS 'Procedure',ERROR_STATE() as 'State', ERROR_MESSAGE() AS 'Message'; 
        THROW  
    END CATCH
GO
CREATE PROCEDURE CreateBank
    @ShortName NVARCHAR(100),
    @BussinesName NVARCHAR(254),
    @SWIFTBIC  NVARCHAR(50),
    @AcctEntry INT = -1,
    @CreateDate DATETIME
    AS
        BEGIN TRY
            IF(LEN(@ShortName) = 0 OR @ShortName = '') BEGIN
                SELECT 500 AS 'Number','CreateBank' AS 'Procedure','F' AS 'State','Short name cannot be empty' AS 'Message';
                RETURN
            END

            IF(LEN(@ShortName) > 100) BEGIN
                SELECT 500 AS 'Number','CreateBank' AS 'Procedure','F' AS 'State','Short name cannot be greater than 100 characteres' AS 'Message';
                RETURN
            END

            IF(@AcctEntry = 0 OR @AcctEntry < -1) BEGIN
                SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Invalid value account' AS 'Message';
                RETURN
            END

            IF(@AcctEntry <> -1) BEGIN
                IF NOT EXISTS(SELECT "Entry" FROM Accounts WHERE "Entry" = @AcctEntry) BEGIN
                    SELECT 500 AS 'Number','CreateAccount' AS 'Procedure','F' AS 'State','Invalid value account, doesn''t exists' AS 'Message';
                    RETURN
                END
            END

            IF(@SWIFTBIC IS NOT NULL AND @SWIFTBIC <> '') BEGIN
                IF EXISTS( SELECT SWIFTBIC FROM Banks WHERE SWIFTBIC = @SWIFTBIC ) BEGIN
                    SELECT 500 AS 'Number','CreateBank' AS 'Procedure','F' AS 'State','Invalid value SWIFTBIC, already exists' AS 'Message';
                    RETURN 
                END
            END

            IF(@BussinesName IS NOT NULL AND @BussinesName <> '') BEGIN
                IF EXISTS( SELECT SWIFTBIC FROM Banks WHERE BussinesName = @BussinesName ) BEGIN
                    SELECT 500 AS 'Number','CreateBank' AS 'Procedure','F' AS 'State','Invalid value BussinesName, already exists' AS 'Message';
                    RETURN 
                END
            END

            INSERT INTO Banks ("Entry", ShortName, BussinesName, SWIFTBIC, AcctEntry, UserSign, CreateDate) 
            VALUES ((SELECT ISNULL(MAX("Entry"), 0) + 1 "Entry" FROM Banks), @ShortName, @BussinesName , @SWIFTBIC , @AcctEntry, -1, @CreateDate)

            SELECT  200 AS 'Number',0 AS Severity,'S' AS 'State','CreateBank' AS 'Procedure',0 AS 'Line', 'Bank Created' AS 'Message'; 
            RETURN

        END TRY
        BEGIN CATCH
            SELECT  500 AS 'Number',ERROR_PROCEDURE() AS 'Procedure',ERROR_STATE() as 'State', ERROR_MESSAGE() AS 'Message';
            THROW
        END CATCH