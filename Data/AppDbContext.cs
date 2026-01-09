using Microsoft.EntityFrameworkCore;
using Motus.Domain;

namespace Motus.Data;

/// <summary>
/// Database context for the Motus application
/// This class manages the connection to the database and provides access to entities
/// Entity Framework Core uses this to generate database tables and handle queries
/// </summary>
public class AppDbContext : DbContext
{
    /// <summary>
    /// Constructor - accepts configuration options (connection string, etc.)
    /// Options are provided by dependency injection in Program.cs
    /// </summary>
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Users table - represents all registered users in the database
    /// Use this property to query, add, update, or delete user records
    /// Example: _context.Users.Where(u => u.Email == email)
    /// </summary>
    public DbSet<User> Users { get; set; }
}
