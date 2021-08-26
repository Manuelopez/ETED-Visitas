using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class GetUserDto
  {
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
  }
}