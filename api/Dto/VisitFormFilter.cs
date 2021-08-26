using System;

namespace api.Dto
{
  public class VisitFormFilter
  {
    public int[] FilterNodes { get; set; }
    public string[] FilterPhase { get; set; }
    public DateTime FilterFromDate { get; set; }
    public DateTime FilterUntilDate { get; set; }
    public string FilterZone { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }

  }
}