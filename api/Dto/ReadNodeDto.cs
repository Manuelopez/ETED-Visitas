using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class ReadNodeDto
  {
    [Required]
    public int Id { get; set; }
    public string Name { get; set; }
    [Required]
    public string Phase { get; set; }
    [Required]
    public string Zone { get; set; }
  }
}