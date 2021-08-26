using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
  public class ImageDto
  {
    [Required]
    public int[] Ids { get; set; }
  }
}