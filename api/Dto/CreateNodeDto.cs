using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class CreateNodeDto
  {
    [Required]
    public string Name { get; set; }
    [Required]
    public string Phase { get; set; }
    [Required]
    public string Zone { get; set; }
    [Required]
    public int GroupId { get; set; }
    [Required]
    public float Latitude { get; set; }
    [Required]
    public float Longitude { get; set; }
  }
}