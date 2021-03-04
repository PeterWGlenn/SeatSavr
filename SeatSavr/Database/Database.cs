using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SeatSavr
{
    public static class Database
    {
        public static Task<Admin[]> GetAdminDataAsync()
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=SeatSavrDB.sqlite3; Version = 3; New = True; Compress = True; ");
            sqlite_conn.Open();

            // Select Table
            SqliteDataReader sqlite_datareader;
            SqliteCommand sqlite_cmd;
            sqlite_cmd = sqlite_conn.CreateCommand();
            sqlite_cmd.CommandText = "SELECT AdminId FROM MANAGER";

            // Convert Table to List of Objects
            sqlite_datareader = sqlite_cmd.ExecuteReader();
            List<Admin> list = new List<Admin>();
            while (sqlite_datareader.Read())
            {
                Admin c = new Admin();
                c.Id = sqlite_datareader.GetInt32(0);

                list.Add(c);
            }
            sqlite_conn.Close();

            return Task.FromResult(list.ToArray());
        }
    }
}
