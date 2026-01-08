using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Motus.Data;
using Motus.Domain;
using Motus.DTOs;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Motus.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("Email already exists.");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            HomeAddress = request.HomeAddress,
            WorkAddress = request.WorkAddress
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || user.PasswordHash != HashPassword(request.Password))
        {
            return Unauthorized("Invalid credentials.");
        }

        // In a real app, return JWT here. For now, simple success.
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

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
