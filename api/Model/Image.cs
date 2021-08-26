namespace api.Model
{
  public class Image
  {
    public int Id { get; set; }
    public int VisitFormId { get; set; }
    public VisitForm VisitForm { get; set; }
    public string Path { get; set; }
  }
}