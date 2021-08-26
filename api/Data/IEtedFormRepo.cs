using System.Collections.Generic;
using api.Dto;
using api.Model;

namespace api.Data
{
  public interface IEtedFormRepo
  {
    bool SaveChanges();
    Node GetNodeById(int id, int groupId);
    Node CreateNode(CreateNodeDto node, int groupId);
    void DeleteNode(Node node);
    Node UpdateNode(Node node, UpdateNodeDto updatedNode);
    List<Node> GetNodes(int groupId);
    User GetUser(GetUserDto user);
    User GetUserById(int userId);
    User UpdateUser(User user, UpdateUserDto updatedUser);
    User CreateUser(CreateUserDto user);
    void DeleteUser(User user);
    VisitForm CreateVisitForm(CreateVisitFormDto visitForm, int groupId, int userId);
    List<VisitForm> GetVisitForms(VisitFormFilter filter, int groupId);
    VisitForm GetVisitForm(int id);
    void DeleteForm(VisitForm form);
    List<Group> GetGroups();
    List<Image> GetImages(ImageDto images);
  }
}