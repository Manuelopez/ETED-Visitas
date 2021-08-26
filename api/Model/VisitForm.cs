using System;
using System.Collections.Generic;

namespace api.Model
{
  public class VisitForm
  {
    public int Id { get; set; }
    public int GroupId { get; set; }
    public Group Group { get; set; }
    public DateTime Date { get; set; }
    public int NodeId { get; set; }
    public Node Node { get; set; }
    public string[] Activity { get; set; }
    public string ReasonForVisit { get; set; }
    public string ActivityDone { get; set; }
    public string Observations { get; set; }
    public string[] StaffPresent { get; set; }
    public ICollection<Image> Images { get; set; }    
    public TimeSpan TimeIn { get; set; }
    public TimeSpan TimeOut { get; set; }
  }
}