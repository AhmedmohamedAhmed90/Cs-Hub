using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cs_Hub.Migrations
{
    public partial class updatecategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "551d186e-bb6c-4e13-9ba6-ddb9c3e61597");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f5ec0769-0a0e-40ec-9698-e5667c862915");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a1df1881-4a18-4b71-aac4-233d9f329e48", "e2ae3441-8a1a-465b-83f3-772f6c6301a4", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f4b410a8-ca48-4971-a1ae-c26f5bb36eea", "9535b8c4-cf59-420a-a25f-b162187e6500", "Admin", "ADMIN" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a1df1881-4a18-4b71-aac4-233d9f329e48");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4b410a8-ca48-4971-a1ae-c26f5bb36eea");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "551d186e-bb6c-4e13-9ba6-ddb9c3e61597", "f8dc04d0-0696-4e54-9393-a6c069a5f3fd", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f5ec0769-0a0e-40ec-9698-e5667c862915", "ac7bdf8b-a5fd-4bc1-a0d6-a63cf6e01279", "Admin", "ADMIN" });
        }
    }
}
