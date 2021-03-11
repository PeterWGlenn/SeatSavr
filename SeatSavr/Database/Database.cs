using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;

namespace SeatSavr
{
    public static class Database
    {
        public static Task<Admin[]> GetAdminDataAsync()
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=Database/SeatSavrDB.sqlite3;");
            sqlite_conn.Open();

            // Select Table
            SqliteDataReader sqlite_datareader;
            SqliteCommand sqlite_cmd;
            sqlite_cmd = sqlite_conn.CreateCommand();
            sqlite_cmd.CommandText = "SELECT * FROM Admin";

            // Convert Table to List of Objects
            sqlite_datareader = sqlite_cmd.ExecuteReader();
            List<Admin> list = new List<Admin>();
            while (sqlite_datareader.Read())
            {
                Admin c = new Admin();

                c.Email = sqlite_datareader.GetString(0);
                c.Privilege = sqlite_datareader.GetInt32(1);

                list.Add(c);
            }
            sqlite_conn.Close();

            return Task.FromResult(list.ToArray());
        }

        public static Task<Area[]> GetAreaDataAsync(string layout)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=Database/SeatSavrDB.sqlite3;");
            sqlite_conn.Open();

            // Select Table
            SqliteDataReader sqlite_datareader;
            SqliteCommand sqlite_cmd;
            sqlite_cmd = sqlite_conn.CreateCommand();
            sqlite_cmd.CommandText = "SELECT * FROM Area WHERE LayoutName = \"" + layout + "\";";

            // Convert Table to List of Objects
            sqlite_datareader = sqlite_cmd.ExecuteReader();
            List<Area> list = new List<Area>();
            while (sqlite_datareader.Read())
            {
                Area c = new Area();

                c.AreaType = (Area.Type)sqlite_datareader.GetInt32(0);

                float x = sqlite_datareader.GetFloat(1);
                float y = sqlite_datareader.GetFloat(2);
                c.AreaLocation = new Point((int)x, (int)y);

                c.NumberOfSeats = sqlite_datareader.GetInt32(3);
                c.Name = sqlite_datareader.GetString(4);

                list.Add(c);
            }
            sqlite_conn.Close();

            return Task.FromResult(list.ToArray());
        }
    }
}
