using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.IO;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectAreaController
    {
        private static string _sendGridKeyFile = $"{Directory.GetCurrentDirectory()}{Path.DirectorySeparatorChar}Keys{Path.DirectorySeparatorChar}SendGridKey.txt";
        private static string _sendGridEmail = "peter.glenn.17@cnu.edu";
        private static string _sendGridName = "SeatSavr";
        private static string _cancelationLink = "https://seatsavr.azurewebsites.net/cancel-reservation?id=";

        [HttpGet("[action]")]
        public Layout GetLayout(string address)
        {
            return Database.GetLayoutAsync(address).Result;
        }

        [HttpPost("[action]")]
        public bool SaveReservation([FromBody] ReservationData d)
        {
            if (!d.IsValid())
                return false;

            Customer c = d.ToCustomer();
            Reservation r = d.ToReservation(c);

            // TODO PG -> add test here to make sure a duplicate reservation is not made!

            // Send confirmation email if successful
            if (Database.AddReservation(d.ToLayout(), r, d.ToArea(), c))
            {
                SendConfirmationEmail(d, r.Id);
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpGet("[action]")]
        public Reservation[] GetReservationsForArea(string x, string y, string name, string address)
        {
            return Database.GetReservations(x, y, name, address).Result;
        }

        private async Task<bool> SendConfirmationEmail(ReservationData d, string reservationId)
        {
            if (!File.Exists(_sendGridKeyFile)) {
                return false;
            }
            string apiKey = File.ReadAllText(_sendGridKeyFile);

            SendGridClient client = new SendGridClient(apiKey);

            EmailAddress from = new EmailAddress(_sendGridEmail, _sendGridName);
            EmailAddress to = new EmailAddress(d.Email, $"{d.FirstName} {d.LastName}");

            string subject = $"Reservation Confirmation - {d.LayoutName} - {d.LocalDate}";
            string content = $"You successfully reserved an area at {d.LayoutName}! Your reservation starts at {d.LocalDate} and lasts {d.Duration} hour(s). You can cancel your reservation using this link: {_cancelationLink}{reservationId}";

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, content, content);
            Response response = await client.SendEmailAsync(msg);

            return response.IsSuccessStatusCode;
        }

        public class ReservationData
        {
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public float Duration { get; set; }
            public string UtcDate { get; set; }
            public string LocalDate { get; set; }
            public float AreaLocX { get; set; }
            public float AreaLocY { get; set; }
            public string Address { get; set; }
            public string LayoutName { get; set; }

            public Layout ToLayout()
            {
                return new Layout()
                {
                    Address = Address,
                    Name = LayoutName
                };
            }
            public Customer ToCustomer()
            {
                return new Customer()
                {
                    Email = Email,
                    FirstName = FirstName,
                    LastName = LastName
                };
            }
            public Reservation ToReservation(Customer c)
            {
                return new Reservation()
                {
                    Id = Reservation.GenerateId(),
                    Date = DateTime.Parse(UtcDate).ToUniversalTime(),
                    Duration = Duration,
                    Customer = c,
                    ReservedAreaName = LayoutName,
                    ReservedAreaAddress = Address
                };
            }

            public Area ToArea()
            {
                return new Area() { AreaLocation = new PointF(AreaLocX, AreaLocY) };
            }

            public bool IsValid()
            {
                return Email != null && IsValidEmail(Email);
            }

            private bool IsValidEmail(string email)
            {
                try
                {
                    var addr = new System.Net.Mail.MailAddress(email);
                    return addr.Address == email;
                }
                catch
                {
                    return false;
                }
            }
        }
    }
}
