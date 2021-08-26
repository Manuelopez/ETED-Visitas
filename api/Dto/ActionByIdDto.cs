using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class ActionByIdDto
  {
    [Required]
    public int Id { get; set; }
  }
}