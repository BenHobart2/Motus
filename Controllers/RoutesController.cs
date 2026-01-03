using Microsoft.AspNetCore.Mvc;

namespace Motus.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetRoute(string from, string to)
    {
        // Mock data logic for demonstration
        // In a real app, this would query a database or GIS service
        
        var routeData = new
        {
            routeId = "Line 12 (Express)",
            eta = "10:05 AM",
            duration = "22 min",
            savings = new { co2 = "0.8kg", money = "$5.50" },
            stops = new[]
            {
                new { name = "Downtown Metro", time = "10:05 AM", completed = true },
                new { name = "Central Park", time = "10:12 AM", completed = false },
                new { name = "Tech District", time = "10:18 AM", completed = false },
                new { name = "North Station", time = "10:27 AM", completed = false }
            }
        };

        return Ok(routeData);
    }
}
