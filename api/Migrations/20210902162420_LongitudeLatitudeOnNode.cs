using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class LongitudeLatitudeOnNode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Latitude",
                table: "Nodes",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Longitude",
                table: "Nodes",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Nodes");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Nodes");
        }
    }
}
