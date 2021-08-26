using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Model;
using Microsoft.IdentityModel.Tokens;

namespace api.Middleware
{
  static public class AuthenticationMiddleware
  {
    static public string GenerateJsonWebToken(User user)
    {
      var securityKey= new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsMySecretKey"));
      var credential = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

      var claims = new[] 
        {
          new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()),
          new Claim(JwtRegisteredClaimNames.Sid, user.GroupId.ToString())
        };
      
      var token = new JwtSecurityToken(
        "EtedApi.com",
        "EtedApi.com",
        claims,
        expires: DateTime.Now.AddDays(7),
        signingCredentials: credential);
      
      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    static public ClaimsPrincipal ValidateJsonWebToken(string tokenToValidate)
    {
     
      TokenValidationParameters validationParameters = new TokenValidationParameters
        {
          ValidateLifetime= true,
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidIssuer = "EtedApi.com",
          ValidAudience = "EtedApi.com",
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsMySecretKey"))
        };
        
      SecurityToken validatedToken;
      JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
      try
      {
        var user = handler.ValidateToken(tokenToValidate, validationParameters, out validatedToken);
        return user;
      }
      catch
      {
        throw new ArgumentException("Invalid Token");
      }
    }
  }
}