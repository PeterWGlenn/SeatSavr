//This controller for an API is from the Auth0 walkthrough
//We will eventually need to remove this


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace APIAuth0.Controllers
{
    [Route("api/[controller]")]
    public class BooksController : Controller
    {
        [HttpGet, Authorize]
        public IEnumerable<Book> Get()
        {
            var currentUser = HttpContext.User;
            var resultBookList = new Book[] {
                new Book { Author = "Ray Bradbury", Title = "Fahrenheit 451", AgeRestriction = false },
                new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude", AgeRestriction = false },
                new Book { Author = "George Orwell", Title = "1984", AgeRestriction = false },
                new Book { Author = "Anais Nin", Title = "Delta of Venus", AgeRestriction = true }
            };

            return resultBookList;
        }

        public class Book
        {
            public string Author { get; set; }
            public string Title { get; set; }
            public bool AgeRestriction { get; set; }
        }
    }
}