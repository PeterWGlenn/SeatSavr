PRAGMA journal_mode=WAL;

CREATE TABLE Admin
(
  Email VARCHAR(255) NOT NULL,
  Privilege INT NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Building
(
  Address VARCHAR(255) NOT NULL,
  PRIMARY KEY (Address)
);

CREATE TABLE Layout
(
  Name VARCHAR(255) NOT NULL,
  BuildingAddress VARCHAR(255) NOT NULL,
  LayoutImage VARCHAR(255),
  PRIMARY KEY (Name),
  FOREIGN KEY (BuildingAddress) REFERENCES Building(Address)
);

CREATE TABLE Area
(
  Type INT NOT NULL,
  X FLOAT NOT NULL,
  Y FLOAT NOT NULL,
  Seats INT NOT NULL,
  Name VARCHAR(255),
  LayoutName VARCHAR(255) NOT NULL,
  PRIMARY KEY (X, Y),
  FOREIGN KEY (LayoutName) REFERENCES Layout(Name)
);

CREATE TABLE Customer
(
  Email VARCHAR(255) NOT NULL,
  First VARCHAR(255) NOT NULL,
  Last VARCHAR(255) NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Manages
(
  Email VARCHAR(255) NOT NULL,
  BuildingAddress VARCHAR(255) NOT NULL,
  PRIMARY KEY (Email, BuildingAddress),
  FOREIGN KEY (Email) REFERENCES Admin(Email),
  FOREIGN KEY (BuildingAddress) REFERENCES Building(Address)
);

CREATE TABLE Reserves
(
  Id INT NOT NULL,
  Date DATE NOT NULL,
  Duration FLOAT NOT NULL,
  CustomerEmail VARCHAR(255) NOT NULL,
  AreaX FLOAT NOT NULL,
  AreaY FLOAT NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (CustomerEmail) REFERENCES Customer(Email),
  FOREIGN KEY (AreaX, AreaY) REFERENCES Area(X, Y)
);

/* Insert Sample Data */
INSERT INTO Admin VALUES ('sampleAdmin123@gmail.com', 23);
INSERT INTO Admin VALUES ('sampleAdmin456@gmail.com', 25);
INSERT INTO Admin VALUES ('sampleAdmin789@gmail.com', 75);

INSERT INTO Building VALUES ('123 Main Street, Washington');

INSERT INTO Layout VALUES ('SampleLayout', '123 Main Street, Washington', null);

INSERT INTO Area VALUES (0, 10, 10, 3, 'Table #2', 'SampleLayout');
INSERT INTO Area VALUES (0, 20, 20, 2, 'Table #4', 'SampleLayout');
INSERT INTO Area VALUES (0, 15, 40, 4, 'Table #7', 'SampleLayout');
INSERT INTO Area VALUES (0, 5, 50, 2, 'Table #8', 'SampleLayout');
INSERT INTO Area VALUES (0, 6, 70, 4, 'Table #9', 'SampleLayout');
INSERT INTO Area VALUES (0, 90, 90, 1, 'Table #10', 'SampleLayout');
INSERT INTO Area VALUES (0, 90, 5, 3, 'Table #11', 'SampleLayout');
INSERT INTO Area VALUES (0, 80, 60, 9, 'Table #12', 'SampleLayout');
INSERT INTO Area VALUES (0, 60, 60, 3, 'Table #13', 'SampleLayout');

INSERT INTO Customer (Email, First, Last) VALUES ('sampleCustomer123@gmail.com', 'Bob', 'Saget');

INSERT INTO Reserves (Id, Date, Duration, CustomerEmail, AreaX, AreaY) VALUES (23312, '3/11/2021 11:37:52 AM', 42.1, 'sampleCustomer123@gmail.com', 20, 20);