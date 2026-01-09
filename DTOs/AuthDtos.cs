namespace Motus.DTOs;

/// <summary>
/// Data Transfer Object for login requests
/// Used to receive login credentials from the frontend
/// </summary>
public class LoginRequest
{
    /// <summary>User's email address</summary>
    public required string Email { get; set; }
    
    /// <summary>User's password (sent as plain text over HTTPS, hashed on server)</summary>
    public required string Password { get; set; }
}

/// <summary>
/// Data Transfer Object for user registration
/// Contains all information needed to create a new user account
/// </summary>
public class RegisterRequest
{
    /// <summary>User's full name</summary>
    public required string Name { get; set; }
    
    /// <summary>User's email address (must be unique)</summary>
    public required string Email { get; set; }
    
    /// <summary>User's chosen password (will be hashed before storage)</summary>
    public required string Password { get; set; }
    
    /// <summary>Optional home address for route planning</summary>
    public string? HomeAddress { get; set; }
    
    /// <summary>Optional work address for commute planning</summary>
    public string? WorkAddress { get; set; }
}
