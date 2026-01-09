namespace Motus.Domain;

/// <summary>
/// User entity representing a registered user in the Motus transit app
/// Stores user profile information and preferences
/// </summary>
public class User
{
    /// <summary>Primary key - auto-generated database ID</summary>
    public int Id { get; set; }
    
    /// <summary>User's full name (required)</summary>
    public required string Name { get; set; }
    
    /// <summary>User's email address - used for login (required, must be unique)</summary>
    public required string Email { get; set; }
    
    /// <summary>Hashed password for authentication (never store plain text!)</summary>
    public string PasswordHash { get; set; } = string.Empty;
    
    /// <summary>Optional home address for route planning</summary>
    public string? HomeAddress { get; set; }
    
    /// <summary>Optional work address for commute planning</summary>
    public string? WorkAddress { get; set; }
    
    /// <summary>User preferences stored as JSON (language, favorite routes, etc.)</summary>
    public string? Preferences { get; set; }
    
    // IMPORTANT: Financial data is explicitly excluded for security
    // No credit card numbers, SSN, bank account info, or payment details are stored
}
