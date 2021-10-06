using System;

namespace api.Model
{
  public class ViaticForm
  {
    public int Id { get; set; }
    public DateTime Date { get; set; } 
    public int UserId { get; set; }
    public User User { get; set; }
    public int NodeId { get; set; }
    public Node Node { get; set; }
    public TimeSpan From { get; set; }
    public TimeSpan Until { get; set; }
  }
}