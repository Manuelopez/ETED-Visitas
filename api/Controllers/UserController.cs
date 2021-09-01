using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using api.Data;
using api.Dto;
using api.Middleware;
using api.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/user")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly IEtedFormRepo _repository;

    public UserController(IEtedFormRepo repository)
    {
      _repository = repository;
    }

    [HttpGet]
    public ActionResult<UserDto> UserInfo()
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
        int userId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);
        var foundUser = _repository.GetUserById(userId);

        UserDto user = new UserDto
        {
          Username = foundUser.Username,
          Name= foundUser.Name,
          LastName = foundUser.LastName
        };

        return Ok(user);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
    }
    [HttpPut]
    public ActionResult<UserDto> UpdateUser(UpdateUserDto updatedUser)
    {
       var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
        int userId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);
        var foundUser = _repository.GetUserById(userId);
        var newUpdatedUser = _repository.UpdateUser(foundUser, updatedUser);
        _repository.SaveChanges();

        UserDto user = new UserDto
        {
          Username = newUpdatedUser.Username,
          Name= newUpdatedUser.Name,
          LastName = newUpdatedUser.LastName
        };

        return Ok(user);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
    }

    [HttpPost("login")]
    public ActionResult<UserDto> GetUser(GetUserDto user)
    {
      var foundUser = _repository.GetUser(user);

      if(foundUser == null) return BadRequest(new {Error = "Error login"});

      bool verified = BCrypt.Net.BCrypt.Verify(user.Password, foundUser.Password);

      if(!verified) return BadRequest(new {Error = "Error login"});
      
      var token = AuthenticationMiddleware.GenerateJsonWebToken(foundUser);
      UserDto returnUser = new UserDto
      {
        Username = foundUser.Username,
        Name = foundUser.Name,
        LastName = foundUser.LastName,
        Token = token
      };

      return Ok(returnUser);
    }

    [HttpPost("isLogged")]
    public ActionResult<object> IsUserLogged()
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
        return Ok(new {Ok = "user logged"});
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }

    }

    [HttpPost("signup")]
    public ActionResult<User> CreateUser(CreateUserDto user)
    {
      try
      {
        if(user.SpecialKey == "ETED_AOFJVWKEOBI")
        {
          string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
          user.Password = passwordHash;
          var newUser = _repository.CreateUser(user);
          _repository.SaveChanges();
          return Ok(new {Ok = "User Created"});
        }
        return BadRequest(new {Errors = "Incorrect Key"});
        
      }
      catch
      {
        return BadRequest(new {Errors = "user exist"});
      }
      
    }

    [HttpDelete]
    public ActionResult<User> DeleteUser(GetUserDto user)
    {
      var foundUser = _repository.GetUser(user);
      _repository.DeleteUser(foundUser);
      return Ok(foundUser);
    }
    
  }
}