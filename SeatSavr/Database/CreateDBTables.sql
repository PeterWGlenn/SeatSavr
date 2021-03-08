CREATE TABLE Admin
(
  Privilege INT NOT NULL,
  Email INT NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Building
(
  Address INT NOT NULL,
  PRIMARY KEY (Address)
);

CREATE TABLE Layout
(
  Name INT NOT NULL,
  BuildingAddress INT NOT NULL,
  PRIMARY KEY (Name),
  FOREIGN KEY (BuildingAddress) REFERENCES Building(Address)
);

CREATE TABLE Area
(
  Type INT NOT NULL,
  X INT NOT NULL,
  Y INT NOT NULL,
  Seats INT NOT NULL,
  Name INT,
  LayoutName INT NOT NULL,
  PRIMARY KEY (X, Y),
  FOREIGN KEY (LayoutName) REFERENCES Layout(Name)
);

CREATE TABLE Customer
(
  Email INT NOT NULL,
  First INT NOT NULL,
  Last INT NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Manages
(
  Email INT NOT NULL,
  BuildingAddress INT NOT NULL,
  PRIMARY KEY (Email, BuildingAddress),
  FOREIGN KEY (Email) REFERENCES Admin(Email),
  FOREIGN KEY (BuildingAddress) REFERENCES Building(Address)
);

CREATE TABLE Reserves
(
  Id INT NOT NULL,
  Date INT NOT NULL,
  Duration INT NOT NULL,
  CustomerEmail INT NOT NULL,
  AreaX INT NOT NULL,
  AreaY INT NOT NULL,
  PRIMARY KEY (CustomerEmail, AreaX, AreaY),
  FOREIGN KEY (CustomerEmail) REFERENCES Customer(Email),
  FOREIGN KEY (AreaX, AreaY) REFERENCES Area(X, Y)
);