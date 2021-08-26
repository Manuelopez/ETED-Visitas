using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class CreateUserDto
  {
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public int GroupId { get; set; }
  }
}