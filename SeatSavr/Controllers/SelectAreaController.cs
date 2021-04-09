using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectAreaController
    {
        private static string _sendGridKeyVariableName = "NAME_OF_THE_ENVIRONMENT_VARIABLE_FOR_YOUR_SENDGRID_KEY";
        private static string _sendGridEmail = "peter.glenn.17@cnu.edu";
        private static string _sendGridName = "SeatSavr";

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

            return Database.AddReservation(d.ToLayout(), d.ToReservation(c), d.ToArea(), c);
        }

        [HttpPost("[action]")]
        public async Task<bool> SendConfirmationEmail([FromBody] ReservationData d)
        {
            string apiKey = Environment.GetEnvironmentVariable(_sendGridKeyVariableName);

            if (apiKey == null)
                return false;

            SendGridClient client = new SendGridClient(apiKey);

            EmailAddress from = new EmailAddress(_sendGridEmail, _sendGridName);
            EmailAddress to = new EmailAddress(d.Email, $"{d.FirstName} {d.LastName}");

            string subject = $"Reservation Confirmation - {d.LayoutName} - {d.Date}";
            string content = $"You successfully reserved an area at {d.LayoutName}! Your reservation starts at {d.Date} and lasts {d.Duration} hours.";

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
            public string Date { get; set; }
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
                    Date = DateTime.Parse(Date).ToUniversalTime(),
                    Duration = Duration,
                    Customer = c
                };
            }

            public Area ToArea()
            {
                return new Area() { AreaLocation = new PointF(AreaLocX, AreaLocY) };
            }

            public bool IsValid()
            {
                return Email != null && Email != string.Empty;
            }
        }
    }
}
