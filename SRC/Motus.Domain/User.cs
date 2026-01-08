namespace Motus.Domain;

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string? HomeAddress { get; set; }
    public string? WorkAddress { get; set; }
    public string? Preferences { get; set; } // JSON string for preferences
    
    // Explicitly excluding financial data as per requirements
    // No CreditCard, SSN, or BankAccount fields
}
