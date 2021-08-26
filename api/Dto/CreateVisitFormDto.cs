using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using api.Model;

namespace api.Dto
{
  public class CreateVisitFormDto
  {
    public DateTime Date { get; set; }
    public int NodeId { get; set; }
    public string[] Activity { get; set; }
    public string ReasonForVisit { get; set; }
    public string ActivityDone { get; set; }
    public string Observations { get; set; }
    public string StaffPresent { get; set; }
    public string[] Images { get; set; }    
    public string TimeIn { get; set; }
    public string TimeOut { get; set; }
  }
}