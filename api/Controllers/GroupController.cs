using api.Data;
using api.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/group")]
  [ApiController]
  public class GroupController : ControllerBase
  {
    private readonly IEtedFormRepo _repository;
    
    public GroupController(IEtedFormRepo repository)
    {
      _repository = repository;        
    }


    [HttpGet]
    public ActionResult<Group> GetGroups()
    {
      var groups = _repository.GetGroups();
      return Ok(groups);
    }
    
  }
}