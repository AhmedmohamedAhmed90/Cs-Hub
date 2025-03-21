using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cs_Hub.Migrations
{
    public partial class UpdateResource : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "453b7ea5-98ac-4918-b54a-12e238f13a53");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b2506b5d-44f3-4397-8452-306b15ecf37e");

            migrationBuilder.AlterColumn<string>(
                name: "URL",
                table: "Resources",
                type: "nvarchar(2083)",
                maxLength: 2083,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "Resources",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "3ea0984c-7f71-400f-9cbe-a5ef079ba70b", "3eca5538-2411-4e02-bcef-708fb28b07b8", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "cbdff158-1c6b-49f6-95a7-bfacbae160e8", "67cd0bc9-d8ae-44c6-8b3f-dfd751b5bbe0", "Admin", "ADMIN" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3ea0984c-7f71-400f-9cbe-a5ef079ba70b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cbdff158-1c6b-49f6-95a7-bfacbae160e8");

            migrationBuilder.AlterColumn<string>(
                name: "URL",
                table: "Resources",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(2083)",
                oldMaxLength: 2083,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "Resources",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "453b7ea5-98ac-4918-b54a-12e238f13a53", "adb7d2b4-bc09-4f54-abd7-8bb0916fa38d", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b2506b5d-44f3-4397-8452-306b15ecf37e", "f4a92c21-6798-4c83-b930-06b74e7f86b0", "User", "USER" });
        }
    }
}
