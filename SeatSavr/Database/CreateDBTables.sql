CREATE TABLE Admin
(
  Privilege INT NOT NULL,
  Email VARCHAR(255) NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Building
(
  Address VARCHAR(255) NOT NULL,
  PRIMARY KEY (Address)
);

CREATE TABLE Layout
(
  Name INT NOT NULL,
  BuildingAddress VARCHAR(255) NOT NULL,
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
  LayoutName INT NOT NULL,
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
  PRIMARY KEY (CustomerEmail, AreaX, AreaY),
  FOREIGN KEY (CustomerEmail) REFERENCES Customer(Email),
  FOREIGN KEY (AreaX, AreaY) REFERENCES Area(X, Y)
);