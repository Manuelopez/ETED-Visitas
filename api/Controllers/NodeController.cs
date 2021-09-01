using System;
using System.Collections.Generic;
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
  [Route("api/node")]
  [ApiController]
  public class NodeController : ControllerBase
  {
    private readonly IEtedFormRepo _repository;
    public NodeController(IEtedFormRepo repository)
    {
      
        _repository = repository;
    }

    [HttpGet]
    public ActionResult<List<Node>> GetNodes()
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }

      int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);

      var foundNodes = _repository.GetNodes(groupId);
      return Ok(foundNodes);
    }

    [HttpGet("{id}")]
    public ActionResult<Node> GetNodeById(int id)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
      int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);

      var foundNode = _repository.GetNodeById(id, groupId);

      if(foundNode == null)
      {
        return NotFound(new {Errors = "Node not found"});
      }
      return Ok(foundNode);
    }

    [HttpPost]
    public ActionResult<Node> CreateNode(CreateNodeDto node)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
      int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);

      var newNode = _repository.CreateNode(node, groupId);
      _repository.SaveChanges();
      return Ok(newNode);
    }
    
    [HttpPut("{id}")]
    public ActionResult<Node> UpdateNode(int id, UpdateNodeDto updatedNode)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
      int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);

      var foundNode = _repository.GetNodeById(id, groupId);
      
      if(foundNode == null)
      {
        return NotFound(new {Errors = "Node not found"});
      }
      var newUdatedNode = _repository.UpdateNode(foundNode, updatedNode);
      _repository.SaveChanges();
      return Ok(newUdatedNode);
    }

    [HttpDelete("{id}")]
    public ActionResult<Node> DeleteNode(int id)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
        int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);
      
      
        var foundNode = _repository.GetNodeById(id, groupId);
        if(foundNode == null)
        {
          return NotFound(new {Errors = "Node not found"});
        }
        _repository.DeleteNode(foundNode);
        _repository.SaveChanges();
        return Ok(foundNode);

      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }

      

    }



  }
}