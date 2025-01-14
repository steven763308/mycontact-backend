CREATE TABLE [dbo].[Users]
(
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing primary key for unique user identification
    [Username] NVARCHAR(50) NOT NULL UNIQUE,     -- Unique username for user login
    [Email] NVARCHAR(100) NOT NULL UNIQUE,       -- User's email, must be unique
    [Password] NVARCHAR(255) NOT NULL,           -- User's password, stored as a hash
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(), -- The date and time the user was created
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()  -- The date and time the user record was last updated
)
