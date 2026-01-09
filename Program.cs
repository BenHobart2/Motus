// Required namespaces for authentication, database, and web API functionality
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.EntityFrameworkCore;

// Create the web application builder - this is the starting point for configuring the app
var builder = WebApplication.CreateBuilder(args);

// === SERVICE CONFIGURATION ===
// Configure services that will be available throughout the application via dependency injection

// Add Azure AD authentication (currently configured but not actively used)
// This allows the app to authenticate users via Microsoft Identity platform
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Register the database context with Entity Framework Core
// This connects to the SQL Server database using the connection string from appsettings.json
builder.Services.AddDbContext<Motus.Data.AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add support for API controllers (enables routing to controller classes)
builder.Services.AddControllers();

// Add OpenAPI/Swagger support for API documentation (only in development)
builder.Services.AddOpenApi();

// Build the application with all configured services
var app = builder.Build();

// === HTTP REQUEST PIPELINE CONFIGURATION ===
// Configure how the app handles incoming HTTP requests

// Enable OpenAPI endpoint only in development environment for API testing
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Redirect HTTP requests to HTTPS for security
app.UseHttpsRedirection();

// Serve default files (like index.html) when accessing the root URL
app.UseDefaultFiles();

// Enable serving static files (HTML, CSS, JS, images) from wwwroot folder
app.UseStaticFiles();

// Enable authorization middleware (checks if users have permission to access resources)
app.UseAuthorization();

// Map controller routes so API endpoints can be accessed
app.MapControllers();

// Fallback to index.html for any unmatched routes (enables client-side routing for SPA)
app.MapFallbackToFile("index.html");

// Start the web application and begin listening for requests
app.Run();

