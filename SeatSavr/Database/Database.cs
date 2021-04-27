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

        #region Read From Database
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

        public static Task<Reservation[]> GetReservations(string areaLocationX, string areaLocationY, string layoutName, string layoutAddress)
        {
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, $"SELECT * FROM Reserves WHERE AreaX =  \'{areaLocationX}\' AND  AreaY =  \'{areaLocationY}\' " +
                                                                       $"AND AreaBuildingAddress = \'{Sanitize(layoutAddress)}\' AND AreaLayoutName = \'{Sanitize(layoutName)}\';");

            List<Reservation> list = new List<Reservation>();
            while (sqlite_datareader.Read())
            {
                Reservation r = new Reservation();

                r.Id = sqlite_datareader.GetString(0);
                r.Date = DateTime.Parse(sqlite_datareader.GetString(1));
                r.Duration = sqlite_datareader.GetFloat(2);

                // Customer fetching
                string customerEmail = sqlite_datareader.GetString(3);
                Customer c = new Customer();
                SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(customerEmail) + "\";");
                while (customerReader.Read())
                {
                    c.Email = customerReader.GetString(0);
                    c.FirstName = customerReader.GetString(1);
                    c.LastName = customerReader.GetString(2);
                }

                r.Customer = c;
                list.Add(r);
            }
            sqlite_conn.Close();

            return Task.FromResult(list.ToArray());

        }

        public static Task<Layout> GetLayoutAsync(string layoutAddress)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Layout WHERE BuildingAddress = \"" + Sanitize(layoutAddress) + "\";");
            Layout l = new Layout();

            // Initialize Layout Data
            while (sqlite_datareader.Read())
            {
                l.Name = sqlite_datareader.GetString(0);
                l.Address = sqlite_datareader.GetString(1);

                // TODO PG -> use images instead of encoding strings to make this more memory efficient
                if (!sqlite_datareader.IsDBNull(2))
                {
                    string base64Enoding = sqlite_datareader.GetString(2);
                    l.LayoutImage = base64Enoding;
                }
            }

            // Initialize Areas 
            sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Area WHERE LayoutName = \"" + Sanitize(l.Name) + "\";");
            List<Area> areas = new List<Area>();

            while (sqlite_datareader.Read())
            {
                Area a = new Area();

                a.AreaType = (Area.Type)sqlite_datareader.GetInt64(0);

                float x = sqlite_datareader.GetFloat(1);
                float y = sqlite_datareader.GetFloat(2);
                a.AreaLocation = new PointF(x, y);

                a.NumberOfSeats = sqlite_datareader.GetInt32(3);
                a.Name = sqlite_datareader.GetString(4);
                a.LayoutName = sqlite_datareader.GetString(5);
                a.LayoutAddress = sqlite_datareader.GetString(6);

                areas.Add(a);
            }
            l.Areas = areas;

            // Add reservation data to Areas
            foreach (Area a in areas)
            {
                sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Reserves WHERE AreaX = " + a.AreaLocation.X + " AND AreaY = " + a.AreaLocation.Y + ";");

                while (sqlite_datareader.Read())
                {
                    Reservation r = new Reservation();

                    r.Id = sqlite_datareader.GetString(0);
                    r.Date = DateTime.Parse(sqlite_datareader.GetString(1));
                    r.Duration = sqlite_datareader.GetFloat(2);

                    // Customer fetching
                    string customerEmail = sqlite_datareader.GetString(3);
                    Customer c = new Customer();
                    SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(customerEmail) + "\";");
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

            if (!l.IsDefined())
                l = null;

            sqlite_conn.Close();

            return Task.FromResult(l);
        }

        public static Task<Layout[]> GetLayoutsAsync()
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            SqliteDataReader layoutDatareader = ReadFrom(sqlite_conn, "SELECT * FROM Layout;");
            List<Layout> layoutList = new List<Layout>();

            // Initialize Layout Data
            while (layoutDatareader.Read())
            {
                Layout l = new Layout();

                l.Name = layoutDatareader.GetString(0);
                l.Address = layoutDatareader.GetString(1);

                // TODO PG -> use images instead of encoding strings to make this more memory efficient
                if (!layoutDatareader.IsDBNull(2))
                {
                    string base64Enoding = layoutDatareader.GetString(2);
                    l.LayoutImage = base64Enoding;
                }

                // Initialize Areas 
                SqliteDataReader areaDatareader = ReadFrom(sqlite_conn, "SELECT * FROM Area WHERE LayoutName = \"" + Sanitize(l.Name) + "\";");
                List<Area> areas = new List<Area>();

                while (areaDatareader.Read())
                {
                    Area a = new Area();

                    a.AreaType = (Area.Type)areaDatareader.GetInt64(0);

                    float x = areaDatareader.GetFloat(1);
                    float y = areaDatareader.GetFloat(2);
                    a.AreaLocation = new PointF(x, y);

                    a.NumberOfSeats = areaDatareader.GetInt32(3);
                    a.Name = areaDatareader.GetString(4);
                    a.LayoutName = areaDatareader.GetString(5);
                    a.LayoutAddress = areaDatareader.GetString(6);

                    areas.Add(a);
                }
                l.Areas = areas;

                // Add reservation data to Areas
                foreach (Area a in areas)
                {
                    areaDatareader = ReadFrom(sqlite_conn, "SELECT * FROM Reserves WHERE AreaX = " + a.AreaLocation.X + " AND AreaY = " + a.AreaLocation.Y + ";");

                    while (areaDatareader.Read())
                    {
                        Reservation r = new Reservation();

                        r.Id = areaDatareader.GetString(0);
                        r.Date = DateTime.Parse(areaDatareader.GetString(1));
                        r.Duration = areaDatareader.GetFloat(2);

                        // Customer fetching
                        string customerEmail = areaDatareader.GetString(3);
                        Customer c = new Customer();
                        SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(customerEmail) + "\";");
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

                layoutList.Add(l);
            }

            sqlite_conn.Close();

            return Task.FromResult(layoutList.ToArray());
        }

        public static Task<Layout[]> GetAdminLayoutsAsync(string adminEmail)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            List<Layout> layoutList = new List<Layout>();
            SqliteDataReader layoutsDatareader = ReadFrom(sqlite_conn, $"SELECT * FROM Layout l, Manages m WHERE l.BuildingAddress = m.BuildingAddress AND m.Email = \'{Sanitize(adminEmail)}\';");

            // Initialize Layout Data
            while (layoutsDatareader.Read())
            {
                Layout l = new Layout();

                l.Name = layoutsDatareader.GetString(0);
                l.Address = layoutsDatareader.GetString(1);

                // TODO PG -> use images instead of encoding strings to make this more memory efficient
                if (!layoutsDatareader.IsDBNull(2))
                {
                    string base64Enoding = layoutsDatareader.GetString(2);
                    l.LayoutImage = base64Enoding;
                }

                // Initialize Areas 
                SqliteDataReader areasDatareader = ReadFrom(sqlite_conn, "SELECT * FROM Area WHERE LayoutName = \"" + Sanitize(l.Name) + "\";");
                List<Area> areas = new List<Area>();

                while (areasDatareader.Read())
                {
                    Area a = new Area();

                    a.AreaType = (Area.Type)areasDatareader.GetInt64(0);

                    float x = areasDatareader.GetFloat(1);
                    float y = areasDatareader.GetFloat(2);
                    a.AreaLocation = new PointF(x, y);

                    a.NumberOfSeats = areasDatareader.GetInt32(3);
                    a.Name = areasDatareader.GetString(4);

                    areas.Add(a);
                }
                l.Areas = areas;

                // Add reservation data to Areas
                foreach (Area a in areas)
                {
                    // TODO PG -> These areas are not layout specific! 
                    areasDatareader = ReadFrom(sqlite_conn, "SELECT * FROM Reserves WHERE AreaX = " + a.AreaLocation.X + " AND AreaY = " + a.AreaLocation.Y + ";");

                    while (areasDatareader.Read())
                    {
                        Reservation r = new Reservation();

                        r.Id = areasDatareader.GetString(0);
                        r.Date = DateTime.Parse(areasDatareader.GetString(1));
                        r.Duration = areasDatareader.GetFloat(2);

                        // Customer fetching
                        string customerEmail = areasDatareader.GetString(3);
                        Customer c = new Customer();
                        SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(customerEmail) + "\";");
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

                layoutList.Add(l);
            }

            sqlite_conn.Close();

            return Task.FromResult(layoutList.ToArray());
        }

        public static Task<Area[]> GetAreaDataAsync(string layout)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            // Initialize Areas 
            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Area WHERE LayoutName = \"" + Sanitize(layout) + "\";");
            List<Area> areas = new List<Area>();

            while (sqlite_datareader.Read())
            {
                Area a = new Area();

                a.AreaType = (Area.Type)sqlite_datareader.GetInt64(0);

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

                    r.Id = sqlite_datareader.GetString(0);
                    r.Date = DateTime.Parse(sqlite_datareader.GetString(1));
                    r.Duration = sqlite_datareader.GetFloat(2);

                    // Customer fetching
                    string customerEmail = sqlite_datareader.GetString(3);
                    Customer c = new Customer();
                    SqliteDataReader customerReader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(customerEmail) + "\";");
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

        public static Area GetArea(Layout l, Area a)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            // Initialize Areas 
            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, $"SELECT * FROM Area WHERE LayoutName = \'{Sanitize(l.Name)}\' " +
                                                                       $"AND BuildingAddress = \'{Sanitize(l.Address)}\' AND X = \'{a.AreaLocation.X}\' AND Y = \'{a.AreaLocation.Y}\';");
            Area retrievedArea = new Area();

            while (sqlite_datareader.Read())
            {
                retrievedArea.AreaType = (Area.Type)sqlite_datareader.GetInt64(0);

                float x = sqlite_datareader.GetFloat(1);
                float y = sqlite_datareader.GetFloat(2);
                retrievedArea.AreaLocation = new Point((int)x, (int)y);

                retrievedArea.NumberOfSeats = sqlite_datareader.GetInt32(3);
                retrievedArea.Name = sqlite_datareader.GetString(4);
            }

            // TODO -> Reservation data

            sqlite_conn.Close();

            if (!retrievedArea.IsDefined())
                return null;

            return retrievedArea;
        }

        public static Task<Customer> GetCustomer(string email)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            // Initialize Areas 
            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, "SELECT * FROM Customer WHERE Email = \"" + Sanitize(email) + "\";");
            Customer retrievedCustomer = new Customer();

            while (sqlite_datareader.Read())
            {
                retrievedCustomer.Email = sqlite_datareader.GetString(0);
                retrievedCustomer.FirstName = sqlite_datareader.GetString(1);
                retrievedCustomer.LastName = sqlite_datareader.GetString(2);
            }

            if (!retrievedCustomer.isDefined())
                retrievedCustomer = null;

            sqlite_conn.Close();

            return Task.FromResult(retrievedCustomer);
        }

        public static async Task<Reservation> GetReservation(string id)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            // Initialize Areas 
            SqliteDataReader sqlite_datareader = ReadFrom(sqlite_conn, $"SELECT * FROM Reserves WHERE Id = \"{id}\";");
            Reservation retrievedReservation = new Reservation();

            while (sqlite_datareader.Read())
            {
                retrievedReservation.Id = sqlite_datareader.GetString(0);
                retrievedReservation.Date = sqlite_datareader.GetDateTime(1);
                retrievedReservation.Duration = sqlite_datareader.GetFloat(2);
                
                string customerEmail = sqlite_datareader.GetString(3);
                retrievedReservation.Customer = await GetCustomer(customerEmail);

                retrievedReservation.ReservedAreaAddress = sqlite_datareader.GetString(6);
                retrievedReservation.ReservedAreaName = sqlite_datareader.GetString(7);
            }

            if (!retrievedReservation.IsDefined())
                retrievedReservation = null;

            sqlite_conn.Close();

            return retrievedReservation;
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
        #endregion

        #region Write to Database
        public static bool UpdateLayout(Layout l)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string clear = "DELETE FROM Area WHERE EXISTS (SELECT * FROM Area WHERE LayoutName = \'" + Sanitize(l.Name) + "\')";
            // TODO PG -> Commenting this out for now until we can fix errors
            //bool didClear = InsertData(sqlite_conn, clear, 1);

            // This does not update the layout name, only the layout image.
            string sqlLayout = "UPDATE Layout SET LayoutImage = \'" + l.LayoutImage + "\' WHERE BuildingAddress = \'" + Sanitize(l.Address) + "\'";
            bool didSucceed = InsertData(sqlite_conn, sqlLayout, 1);

            // Insert Areas
            foreach (Area a in l.Areas)
            {
                if (GetArea(l, a) == null)
                    didSucceed = didSucceed && AddArea(l, a); // TODO PG -> This code locks the database
            }

            sqlite_conn.Close();
            return didSucceed;
        }

        public static bool DeleteLayout(Layout l)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string sql = $"DELETE FROM Layout WHERE Name = \'{Sanitize(l.Name)}\' AND BuildingAddress = \'{Sanitize(l.Address)}\'";
            bool didSucceed = InsertData(sqlite_conn, sql, 1);

            sqlite_conn.Close();
            return didSucceed;
        }

        public static bool AddReservation(Layout l, Reservation r, Area a, Customer c)
        {
            // Add customer if needed
            string sqlCustomer = $"INSERT OR REPLACE INTO Customer (Email, First, Last) VALUES(\'{Sanitize(c.Email)}\', \'{Sanitize(c.FirstName)}\', \'{Sanitize(c.LastName)}\');";

            string sqlReservation = "INSERT INTO Reserves (Id, Date, Duration, CustomerEmail, AreaX, AreaY, AreaBuildingAddress, AreaLayoutName) VALUES(\'" +
                r.Id + "\', \'" +
                r.Date.ToString() + "\', \'" +
                r.Duration.ToString() + "\', \'" +
                Sanitize(r.Customer.Email) + "\', \'" +
                a.AreaLocation.X + "\', \'" +
                a.AreaLocation.Y + "\', \'" +
                Sanitize(l.Address) + "\', \'" +
                Sanitize(l.Name) + "\');";

            int rowsModified = 0;
            using (SqliteConnection conn = new SqliteConnection("Data Source=" + _dbLocation + ";"))
            {
                conn.Open();
                using (SqliteCommand cmd = new SqliteCommand(sqlCustomer + sqlReservation, conn))
                {
                    rowsModified = cmd.ExecuteNonQuery();
                }
            }

            return rowsModified != 0;
        }

        public static bool AddArea(Layout l, Area a)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string sql = "INSERT INTO Area (Type, X, Y, Seats, Name, LayoutName, BuildingAddress) VALUES(\'" +
                (int)a.AreaType + "\', \'" +
                a.AreaLocation.X + "\', \'" +
                a.AreaLocation.Y + "\', \'" +
                a.NumberOfSeats + "\', \'" +
                Sanitize(a.Name) + "\', \'" +
                Sanitize(l.Name) + "\', \'" +
                Sanitize(l.Address) + "\');";
            bool didSucceed = InsertData(sqlite_conn, sql, 1);

            sqlite_conn.Close();
            return didSucceed;
        }

        public static bool AddLayout(Layout l, Admin a)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string buildingSql = $"INSERT INTO Building (Address) VALUES(\'{Sanitize(l.Address)}\');";

            string layoutSql = "INSERT INTO Layout (Name, BuildingAddress) VALUES(\'" +
                Sanitize(l.Name) + "\', \'" +
                Sanitize(l.Address) + "\');";

            string managesSql = "INSERT INTO Manages (Email, BuildingAddress) VALUES(\'" +
                Sanitize(a.Email) + "\', \'" +
                Sanitize(l.Address) + "\');";

            bool didSucceed = InsertData(sqlite_conn, buildingSql, 1) && InsertData(sqlite_conn, layoutSql, 1) && InsertData(sqlite_conn, managesSql, 1);

            sqlite_conn.Close();
            return didSucceed;
        }

        public static bool AddAdmin(Admin a)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string sql = "INSERT OR REPLACE INTO Admin (Email, Privilege) VALUES(\'" +
                Sanitize(a.Email) + "\', \'" +
                a.Privilege + "\');";

            bool didSucceed = InsertData(sqlite_conn, sql, 1);

            sqlite_conn.Close();
            return didSucceed;
        }

        public static bool CancelReservation(string id)
        {
            // Create a new database connection
            SqliteConnection sqlite_conn = new SqliteConnection("Data Source=" + _dbLocation + ";");
            sqlite_conn.Open();

            string sql = $"DELETE FROM Reserves WHERE Id = \"{id}\"";

            bool didSucceed = InsertData(sqlite_conn, sql, 1);

            sqlite_conn.Close();
            return didSucceed;
        }

        private static bool InsertData(SqliteConnection conn, string command, int expectedExReturn)
        {
            SqliteCommand sqlite_cmd;
            sqlite_cmd = conn.CreateCommand();
            sqlite_cmd.CommandText = command;

            return sqlite_cmd.ExecuteNonQuery() == expectedExReturn;
        }

        // Sanitize input to SQL command
        private static string Sanitize(string s)
        {
            return s?.Replace("\'", "\'\'").Replace("\"", "\"\"") ?? null;
        }
        #endregion
    }
}
