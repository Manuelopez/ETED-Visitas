namespace api.Model
{
  public class Node
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Phase { get; set; }
    public string Zone { get; set; }
    public int GroupId { get; set; }
    public Group Group { get; set; }
  }
}