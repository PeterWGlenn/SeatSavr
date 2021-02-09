# SeatSavr

## Introduction
Movie theatres often use a seat reservation web or mobile application to allow customers to see which seats are available and select specific seats. Although many institutions also use reservation software, they seldom allow the customer to select specific seats to reserve. This is the problem our web application would solve.
 
## Project Background
In the midst of a pandemic-ridden world, reservation systems are more needed than ever. Every in-person business needs to keep track of customer density at all times to comply with local regulations. A solution to this problem is a reservation system. Such a system allows a business to track how many people are in their building at any given time, and restrict access to customers after a certain limit is reached. Such a system also allows customers to know if they will be guaranteed access to a business at a set time. 
Our web application would create a reservation system that allows for advanced functionality for businesses serving various markets. Our web application would offer a single solution to any business that owns a property with seats, from restaurants to hotels. 
We are interested in building a robust web application to gain full-stack web development experience that we can carry with us into our careers after graduation. Our proposed web application would involve frontend development, backend development, database creation and management, user account and permissions management, and data security. Such technologies can be applied to solve many business problems in the real world. 

## Project Description
We will create a web application that allows businesses to create a reservation web page. The business administrator will use a native application editor to create a top-down model of their seat layout. Then customers can access the reservation web page of a business to reserve seats. Customers will be able to reserve specific seats, rooms, or areas through the business reservation page. 
Proposed Solution
Development Approach
We intend on utilizing the Agile Development Approach to offer a solution to this problem. As we are relatively inexperienced in building web applications, we may learn during the process that our requirements for the reservation system may change. The Agile approach will allow us to change those requirements during the development, as well as educate us on this process that is used by many employers and software development companies. Using this methodology will allow us to be more creative and flexible in its implementation, even though the general timeline will be a little less predictable. In order to meet the requirements of this capstone and our desire for our product to be user friendly, we will also take certain aspects from the waterfall approach, most prominently the focus on documentation, into our development approach.  

## High Level Plan
We plan on utilizing tools and products developed by Microsoft to complete this project. We will use Visual Studio as our IDE, developing the front-end of the reservation system with JavaScript and the back-end using C#. We plan on experimenting with different JavaScript libraries to help develop the front end. We are currently looking into React and Angular. We are also looking into applying different Style Libraries to our HTML mockups to see which library would best suit our needs. To have the flexibility to run our web server on a wide array of Operating Systems, we are planning to use the .NET Core 3.1 framework. 
To follow suit with the Microsoft solutions, we plan on implementing a database using SQLite (see Appendix A) in conjunction with Azure Cloud Services (see Appendix B). We will use a GitHub Repository to manage version control and deploying to the Cloud Service. For designing the web application’s user interface, we plan on using another web application called Figma (see Appendix C), which allows us to collaborate and create UI’s. We plan on using Auth0 (see Appendix D)  for managing the authentication and authorization for the web application due to its widespread popularity and a sizable free tier of features available.  

## Project Schedule
For this project to be successful, the following tasks must be completed;
*	Server Establishment and Resource Set Up (20 hours)
*	Designing Front End Mockups (10 hours)
*	Database Design and Implementation with User Accounts (80 hours)
*	Client and Business Side UI (25 hours)
*	Reservation Designing Tool Development (25 hours)
*	Testing (20)

## Project Calendar
Intermediate Milestones
Intermediate Milestone #1
*	Business Administrators can create accounts, create seating layouts based on an image they provide, and save these layouts to a database. These layouts can be  accessed from a front-facing Client interface using a business-specific link.
Intermediate Milestone #2
*	Business Administration Accounts can create location blueprints with the web application’s UI. These blueprints allow the administrator to construct their floor plan from scratch. Administrators can move tables and chairs via the editor when necessary. Customers can read and write reservations using the blueprint structure through a front-facing interface. Administrators can visually view reservation data through a simple dashboard.

## Weekly Updates
### Weekly Update #1 (week of February 8th)
*	Github repo set up with basic class structure for project (3 hours)
*	Azure Cloud free-tier server set up (1 hour)
*	Research possible libraries / technologies to use (4 hours)
*	Workflow diagrams (2 hours)
*	UI form mock-ups (2 hours)
*	Database requirements and structure planning (4 hours) 
### Weekly Update #2 (week of February 15th)
*	More design diagramming and mocking up (4 hours)
*	Initial backend / front end development (8 hours)
*	Research into Auth0 (4 hours)
### Weekly Update #3  (week of February 22nd)
*	Initial database implementation with broad structure (10 hours)
*	Hookup of simple database to backend (8 hours)
### Weekly Update #4 (week of March 1st)
*	Implementation of user accounts and Auth0 (6 hours)
*	Improve frontend to make use of database objects in backend (6 hours)
*	Allow admins to upload a photo to be the background of floor plans (3 hours)
*	Allow admins to add seat locations to floor plans (3 hours)
### Weekly Update #5 (week of March 8th)
*	Develop robust backend for administrator and customer accounts (if customer accounts are needed) (12 hours)
*	Create UI to allow customers to access floor plans and reserve seats (4 hours)
*	Testing and bug fixing (2 hours) 
### Weekly Update #6 (week of March 15th, 1st Milestone)
*	Implement more database fields following general structure (6 hours)
*	Make backend capable of handling more database fields (4 hours)
*	Develop more robust UI capable of reading and writing several fields to the database (8 hours)
### Weekly Update #7 (week of March 22nd)
*	Add small improvements (e.g. better validation) (4 hours)
*	Reservation email confirmation (4 hours)
*	Reservation deletion (2 hours)
*	Begin administration editor development (8 hours)
### Weekly Update #8 (week of March 29th)
*	Continue administration editor development (8 hours)
*	Administration / customer-facing dashboard exploration (8 hours)
### Weekly Update #9 (week of April 5th, 2nd Milestone)
*	Administration editor finalization (2 hours)
*	Dashboard development (8 hours)
*	UI improvements (4 hours)
*	Bug fixes (2 hours)
*	Maybe buy domain and Azure Cloud paid plan (2 hours)
### Weekly Update #10 (week of April 12th)
*	Testing and UI Adjustments (18 hours)
### Weekly Update #11 (week of April 19th)
*	Testing and UI Adjustments (18 hours)
### Weekly Update #12 (week of April 26th, Project Due)
*	Final Presentation

## Project Deliverables
*	System Vision Document: 1-2 page brief description of the vision for this project/system being built
*	Stakeholder Identification: Discussion of who the target users will be, and potential users in the future if relevant. 
*	Analysis Results/User Stories: Results of analysis phased in the form of user stories
*	Database Entity Relationship Diagrams: graphical representation of the normalized database to be implemented
*	GUI Mockups: initial graphical representations of the graphical user interface to be developed
*	Architecture Diagrams: graphical representation of the architecture this system will utilize
*	User Workflow Diagram: graphical representation of the steps each user type takes to utilize the web application
### Technical Deliverables
*	Link to GIT repo with completed code for project including scripts for creating databases and instructions/readme documentation 
*	Business Account Creation Link and Sample Business Page Link
### Final Presentation Deliverables
*	Product demonstration (with audience participation if they are willing)

## Conclusion
We will create a web application to be used by businesses to create a webpage that allows their customers to reserve specific seats or areas. The web application is for any business with facilities where location of reservation matters. Such businesses include restaurants, hotels, movie theaters, schools, and libraries. SeatSavr will help business owners follow COVID-19 regulations and give customers a higher degree of freedom and choice in their reservations. 
We expect to be able to meet these high-level goals in approximately 180 total hours of work. This translates to 9 hours of work from each of us each week. We are concerned that our time estimates may be off, and that we may have goals that are too pessimistic or too unrealistic. However, we believe that we can implement the core functionality of the web application in the allotted time. 
