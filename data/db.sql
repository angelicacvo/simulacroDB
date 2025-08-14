create table users(
id_document varchar(45) primary key not null, 
full_name varchar(120) not null, 
address varchar(80) not null,
phone_number varchar(45) not null unique, 
email varchar(120) not null unique
);

create table invoices (
id_invoice varchar(45) primary key not null ,
used_platform enum('Nequi', 'Daviplata'),
billing_period VARCHAR(45) not null,
amount int not null,
amount_paid int not null,
id_document varchar(45) not null,
FOREIGN KEY (id_document) REFERENCES users(id_document)
);

create table transactions (
id_transaction varchar(25) primary key not null,
date DATE not null,
hour TIME not null,
amount int not null,
status enum("Pendiente", "Fallida", "Completada"),
type enum("Pago de factura"),
id_invoice varchar(20),
foreign key (id_invoice) references invoices(id_invoice)
);