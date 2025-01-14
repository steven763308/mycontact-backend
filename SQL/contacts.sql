CREATE TABLE [dbo].[contacts]
(
    [ContactId] INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing primary key for unique contact identification
    [UserId] INT NOT NULL,                              -- Foreign key to link with Users table
    [Name] NVARCHAR(100) NOT NULL,                      -- Contact's name
    [Email] NVARCHAR(100),                              -- Contact's email address
    [Phone] NVARCHAR(50),                               -- Contact's phone number
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),   -- The date and time the contact was created
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),   -- The date and time the contact record was last updated
    CONSTRAINT FK_MyContacts_Users FOREIGN KEY (UserId) REFERENCES [dbo].[Users] (Id)
        ON DELETE CASCADE                               -- Deleting a user will delete all associated contacts
)
