using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cs_Hub.Migrations
{
    public partial class UpdateResourceCategoryRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResourceCategories");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a1df1881-4a18-4b71-aac4-233d9f329e48");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4b410a8-ca48-4971-a1ae-c26f5bb36eea");

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Resources",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "453b7ea5-98ac-4918-b54a-12e238f13a53", "adb7d2b4-bc09-4f54-abd7-8bb0916fa38d", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b2506b5d-44f3-4397-8452-306b15ecf37e", "f4a92c21-6798-4c83-b930-06b74e7f86b0", "User", "USER" });

            migrationBuilder.CreateIndex(
                name: "IX_Resources_CategoryID",
                table: "Resources",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_Categories_CategoryID",
                table: "Resources",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resources_Categories_CategoryID",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_CategoryID",
                table: "Resources");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "453b7ea5-98ac-4918-b54a-12e238f13a53");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b2506b5d-44f3-4397-8452-306b15ecf37e");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Resources");

            migrationBuilder.CreateTable(
                name: "ResourceCategories",
                columns: table => new
                {
                    ResourceID = table.Column<int>(type: "int", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceCategories", x => new { x.ResourceID, x.CategoryID });
                    table.ForeignKey(
                        name: "FK_ResourceCategories_Categories_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Categories",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResourceCategories_Resources_ResourceID",
                        column: x => x.ResourceID,
                        principalTable: "Resources",
                        principalColumn: "ResourceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a1df1881-4a18-4b71-aac4-233d9f329e48", "e2ae3441-8a1a-465b-83f3-772f6c6301a4", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f4b410a8-ca48-4971-a1ae-c26f5bb36eea", "9535b8c4-cf59-420a-a25f-b162187e6500", "Admin", "ADMIN" });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceCategories_CategoryID",
                table: "ResourceCategories",
                column: "CategoryID");
        }
    }
}
