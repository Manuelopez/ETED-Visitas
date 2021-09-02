using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using api.Data;
using api.Dto;
using api.Middleware;
using api.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/visitform")]
  [ApiController]
  public class VisitFormController : ControllerBase
  {
    public readonly IEtedFormRepo _repository;

    public VisitFormController(IEtedFormRepo repository)
    {
      _repository = repository;
    }

    [HttpPost]
    public ActionResult<VisitForm> CreateVisitForm(CreateVisitFormDto visitForm)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();
        
      Console.WriteLine(tokenToValidate);

      ClaimsPrincipal claims;
      
      Console.WriteLine(visitForm);
  
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);
        int groupId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sid).Value);
        int userId = Convert.ToInt32(claims.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);
      
      
        VisitForm newVisitForm = _repository.CreateVisitForm(visitForm, groupId, userId);
        _repository.SaveChanges();
      
      return Ok(new {Ok= "ok"});
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }

      
    }

    [HttpPost("filter")]
    public ActionResult<List<VisitForm>> GetVisitForms(VisitFormFilter filter)
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

        return _repository.GetVisitForms(filter, groupId);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
    
    }

    [HttpPost("images")]
    public ActionResult<List<GetImageDto>> GetImages(ImageDto images)
    {
      List<GetImageDto> convertedImages = new List<GetImageDto>();
      var foundImages = _repository.GetImages(images);
      foreach(var img in foundImages)
      {
        Byte[] bytes = System.IO.File.ReadAllBytes(img.Path);
        string base64Image = Convert.ToBase64String(bytes);
        GetImageDto newImage = new GetImageDto 
        {
          Id = img.Id,
          Data = base64Image
        };
        convertedImages.Add(newImage);
      }
      return Ok(convertedImages);
    }

    [HttpDelete("{id}")]
    public ActionResult<VisitForm> DeleteForm(int id)
    {
      var tokenToValidate = this.HttpContext.Request.Headers["Authorization"]
        .ToString()
        .Substring("Bearer ".Length)
        .Trim();

      ClaimsPrincipal claims;
      
      try
      {
        claims = AuthenticationMiddleware.ValidateJsonWebToken(tokenToValidate);

        var foundForm = _repository.GetVisitForm(id);
        if(foundForm == null) BadRequest(new {Errors = "Form not Found"});
        _repository.DeleteForm(foundForm);
        _repository.SaveChanges();

        return Ok(foundForm);
      }
      catch
      {
        return BadRequest(new {Errors = "Invalid Token"});
      }
      
    }

  }
}