using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Motus.Data;
using Motus.Domain;
using Motus.DTOs;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Motus.Controllers;

/// <summary>
/// Authentication controller handling user registration and login
/// Routes: /api/auth/register and /api/auth/login
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Database context for accessing user data
    private readonly AppDbContext _context;

    /// <summary>
    /// Constructor - dependency injection provides the database context
    /// </summary>
    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Register a new user account
    /// POST /api/auth/register
    /// </summary>
    /// <param name="request">Registration data including name, email, password, and addresses</param>
    /// <returns>Success message with user ID, or error if email already exists</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Check if email is already registered
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("Email already exists.");
        }

        // Create new user with hashed password (never store plain text passwords!)
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password), // Hash the password for security
            HomeAddress = request.HomeAddress,
            WorkAddress = request.WorkAddress
        };

        // Save the new user to the database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful", userId = user.Id });
    }

    /// <summary>
    /// Login with existing credentials
    /// POST /api/auth/login
    /// </summary>
    /// <param name="request">Login credentials (email and password)</param>
    /// <returns>User profile data if credentials are valid, or Unauthorized error</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Find user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        // Verify user exists and password matches (compare hashed versions)
        if (user == null || user.PasswordHash != HashPassword(request.Password))
        {
            return Unauthorized("Invalid credentials.");
        }

        // NOTE: In production, this should return a JWT token for secure session management
        // Currently returns user data directly for simplicity
        return Ok(new { 
            message = "Login successful", 
            user = new { 
                user.Id, 
                user.Name, 
                user.Email,
                user.Preferences
            } 
        });
    }

    /// <summary>
    /// Hash password using SHA256 algorithm
    /// WARNING: For production, use a more secure algorithm like bcrypt or PBKDF2
    /// that includes salting and multiple iterations
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <returns>Base64-encoded hash of the password</returns>
    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
