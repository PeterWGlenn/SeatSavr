using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;

namespace SeatSavr
{
    public static class Database
    {
        public static Task<Admin[]> GetAdminDataAsync()
        {
            Tuple<SqliteConnection, SqliteDataReader> dbTuple = ConnectAndReadFrom("SELECT * FROM Admin");
            SqliteConnection sqlite_conn = dbTuple.Item1;
            SqliteDataReader sqlite_datareader = dbTuple.Item2;

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
            Tuple<SqliteConnection, SqliteDataReader> dbTuple = ConnectAndReadFrom("SELECT * FROM Area WHERE LayoutName = \"" + layout + "\";");
            SqliteConnection sqlite_conn = dbTuple.Item1;
            SqliteDataReader sqlite_datareader = dbTuple.Item2;

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

        private static Tuple<SqliteConnection, SqliteDataReader> ConnectAndReadFrom(string command)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=Database/SeatSavrDB.sqlite3;");
            sqlite_conn.Open();

            // Select Table
            SqliteDataReader sqlite_datareader;
            SqliteCommand sqlite_cmd;
            sqlite_cmd = sqlite_conn.CreateCommand();
            sqlite_cmd.CommandText = command;
            
            // Convert Table to List of Objects
            sqlite_datareader = sqlite_cmd.ExecuteReader();

            return new Tuple<SqliteConnection, SqliteDataReader>(sqlite_conn, sqlite_datareader);
        }
    }
}
