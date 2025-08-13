create database pd_jhon_rojas_vanrossum

create table clients(
document_number varchar(45) primary key not null, 
full_name varchar(120) not null, 
address varchar(80) not null,
phone_number varchar(45) not null unique, 
email varchar(120) not null unique

);
create table invoices (
invoice_number varchar(45) primary key not null ,
used_platform enum('Nequi', 'Daviplata'),
billing_period VARCHAR(45) not null,
amount int not null,
ammount_paid int not null,
document_number varchar(45) not null,
FOREIGN KEY (document_number) REFERENCES clients(document_number)

);

create table transactions (
id_transaction varchar(25) primary key not null,
date DATE not null,
hour TIME not null,
ammount int not null,
status enum("Pendiente", "Fallida", "Completada"),
type enum("Pago de factura"),
invoice_number varchar(20),
foreign key (invoice_number) references invoices(invoice_number)

);