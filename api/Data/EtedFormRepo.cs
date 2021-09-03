using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using api.Dto;
using api.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class EtedFormRepo : IEtedFormRepo
  {
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _webHostEnviroment;


    public EtedFormRepo(AppDbContext context, IWebHostEnvironment webHostEnvironment)
    {
        _context = context;
      _webHostEnviroment = webHostEnvironment;

    }
    public Node CreateNode(CreateNodeDto node,int groupId)
    {
      Node newNode = new Node
      {
        Name = node.Name,
        Phase = node.Phase,
        Zone = node.Zone,
        GroupId = groupId,
        Latitude = node.Latitude,
        Longitude = node.Longitude
      };
      _context.Nodes.Add(newNode);

      return newNode;
    }

    public User CreateUser(CreateUserDto user)
    {
      User newUser = new User
      {
        Username = user.Username,
        Password = user.Password,
        Name = user.Name,
        LastName = user.LastName,
        GroupId = user.GroupId
      };

      
      _context.Users.Add(newUser);
      
      
      return newUser;
    }

    public VisitForm CreateVisitForm(CreateVisitFormDto visitForm, int groupId, int userId)
    {
      var user= _context.Users.Where(u => u.Id == userId).FirstOrDefault();
      string name = $"{user.Name} {user.LastName}";

      string[] staffPresent = new string[] {name, visitForm.StaffPresent};
      
      TimeSpan timeIn = TimeSpan.Parse(visitForm.TimeIn);
      TimeSpan timeOut = TimeSpan.Parse(visitForm.TimeOut);
      string path = $"{_webHostEnviroment.ContentRootPath}/UserImages";
      
      VisitForm newVisitForm = new VisitForm
      {
        Date = visitForm.Date,
        NodeId = visitForm.NodeId,
        Activity = visitForm.Activity,
        ReasonForVisit = visitForm.ReasonForVisit,
        ActivityDone = visitForm.ActivityDone,
        Observations = visitForm.Observations,
        StaffPresent = staffPresent,
        GroupId = groupId,
        TimeIn = timeIn,
        TimeOut = timeOut
      };
      List<Image> images = new List<Image>();
      foreach(var image in visitForm.Images)
      {
        Guid g = Guid.NewGuid();
        var thisImagePath = path + $"/{g}.jpg";
        Image imageToSave = new Image 
        {
          Path = thisImagePath,
          VisitForm = newVisitForm
        };
        
        images.Add(imageToSave);
        var imageBase64 = image;
        byte[] bytes = Convert.FromBase64String(imageBase64);
        System.IO.File.WriteAllBytes(thisImagePath, bytes);
      }
      _context.Images.AddRange(images);
      
      _context.VisitForms.Add(newVisitForm);
      return newVisitForm;
    }

    public void DeleteForm(VisitForm form)
    {
      foreach(var img in form.Images)
      {
        if(File.Exists(img.Path))
        {
          File.Delete(img.Path);
        }
      }
      _context.VisitForms.Remove(form);
    }

    public void DeleteNode(Node node)
    {
      _context.Nodes.Remove(node);
    }

    public void DeleteUser(User user)
    {
      _context.Users.Remove(user);
    }

    public List<Group> GetGroups()
    {
      return _context.Groups.ToList();
    }

    public List<Image> GetImages(ImageDto images)
    {
      return _context.Images.Where(i => images.Ids.Contains(i.Id)).ToList();
    }

    public Node GetNodeById(int id, int groupId)
    {

      return _context.Nodes.Where(n => n.Id == id && n.GroupId == groupId).FirstOrDefault();
    }

    public List<Node> GetNodes(int groupId)
    {
      return _context.Nodes.Where(n => n.GroupId == groupId).ToList();
    }

    public User GetUser(GetUserDto user)
    {
      return _context.Users.Where(u => u.Username == user.Username).FirstOrDefault();
    }

    public User GetUserById(int userId)
    {
      return _context.Users.Where(u => u.Id == userId).FirstOrDefault();;
    }

    public VisitForm GetVisitForm(int id)
    {
      return _context.VisitForms.Where(f => f.Id == id).Include(f => f.Images).FirstOrDefault();
    }

    public List<VisitForm> GetVisitForms(VisitFormFilter filter, int groupId)
    {
      
      var visitForms = _context.VisitForms
        .Where(f => f.GroupId == groupId)
        .Include(f => f.Node)
        .Include(f => f.Images)
        .OrderBy(f => f.Id)
        .Skip(filter.Skip)
        .AsQueryable();
     
      if(filter.Take > 0)
      {
        visitForms = visitForms.Take(filter.Take);
      }
      if(filter.FilterNodes.Length > 0)
      {
        visitForms = visitForms.Where(form => filter.FilterNodes.Contains(form.NodeId));
      }
      if(filter.FilterPhase.Length > 0)
      {
        visitForms = visitForms.Where(form => filter.FilterPhase.Contains(form.Node.Phase));
      }  
      if(filter.FilterFromDate != new DateTime())
      {
        visitForms = visitForms.Where(form => form.Date >= filter.FilterFromDate);

      }
      if(filter.FilterUntilDate != new DateTime())
      {
        visitForms = visitForms.Where(form => form.Date <= filter.FilterUntilDate);
      }
      if(filter.FilterZone != "" || filter.FilterZone != null)
      {
        visitForms = visitForms.Where(from => from.Node.Zone.Contains(filter.FilterZone));
      }

      return visitForms.ToList();
    }

    public bool SaveChanges()
    {
      return (_context.SaveChanges() >= 0);
    }

    public Node UpdateNode(Node node, UpdateNodeDto updateNode)
    {
      node.Name = updateNode.Name;
      node.Zone = updateNode.Zone;
      node.Phase = updateNode.Phase;
      node.Longitude = updateNode.Longitude;
      node.Latitude = updateNode.Latitude;
      return node;
    }

    public User UpdateUser(User user, UpdateUserDto updatedUser)
    {
      string passwordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
      user.Username = updatedUser.Username;
      user.Name = updatedUser.Name;
      user.LastName = updatedUser.LastName;
      user.Password = passwordHash;
      
      return user;
    }
  }
}