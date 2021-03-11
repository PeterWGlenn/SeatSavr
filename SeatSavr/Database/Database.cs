using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;

namespace SeatSavr
{
    public static class Database
    {
        private static string _dbLocation = "Database/SeatSavrDB.sqlite3";

        public static Task<Admin[]> GetAdminDataAsync()
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Admin");

            List<Admin> list = new List<Admin>();
            while (sqlite_datareader.Read())
            {
                Admin a = new Admin();

                a.Email = sqlite_datareader.GetString(0);
                a.Privilege = sqlite_datareader.GetInt32(1);

                list.Add(a);
            }
            sqlite_conn.Close();

            return Task.FromResult(list.ToArray());
        }

        public static Task<Area[]> GetAreaDataAsync(string layout)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            // Initialize Areas 
            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Area WHERE LayoutName = \"" + layout + "\";");
            List<Area> areas = new List<Area>();

            while (sqlite_datareader.Read())
            {
                Area a = new Area();

                a.AreaType = (Area.Type)sqlite_datareader.GetInt32(0);

                float x = sqlite_datareader.GetFloat(1);
                float y = sqlite_datareader.GetFloat(2);
                a.AreaLocation = new Point((int)x, (int)y);

                a.NumberOfSeats = sqlite_datareader.GetInt32(3);
                a.Name = sqlite_datareader.GetString(4);

                areas.Add(a);
            }

            // Add reservation data to Areas
            foreach (Area a in areas)
            {
                sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Reserves WHERE AreaX = " + a.AreaLocation.X + " AND AreaY = " + a.AreaLocation.Y + ";");

                while (sqlite_datareader.Read())
                {
                    Reservation r = new Reservation();

                    r.Id = sqlite_datareader.GetInt32(0);
                    r.Date = DateTime.Parse(sqlite_datareader.GetString(1));
                    r.Duration = sqlite_datareader.GetFloat(2);

                    // Customer fetching
                    string customerEmail = sqlite_datareader.GetString(3);
                    Customer c = new Customer();
                    SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + customerEmail + "\";");
                    while (customerReader.Read())
                    {
                        c.Email = customerReader.GetString(0);
                        c.FirstName = customerReader.GetString(1);
                        c.LastName = customerReader.GetString(2);
                    }

                    r.Customer = c;

                    a.Reservations.Add(r);
                }
            }

            sqlite_conn.Close();

            return Task.FromResult(areas.ToArray());
        }

        private static SqliteDataReader ReadFrom(SqliteConnection conn, string command)
        {
            // Select Table
            SqliteDataReader sqlite_datareader;
            SqliteCommand sqlite_cmd;
            sqlite_cmd = conn.CreateCommand();
            sqlite_cmd.CommandText = command;
            
            // Convert Table to List of Objects
            sqlite_datareader = sqlite_cmd.ExecuteReader();

            return sqlite_datareader;
        }
    }
}
