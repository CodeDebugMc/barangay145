CREATE TABLE solo_parent (
id int(11) NOT null AUTO_INCREMENT,
resident_id int(11),
name varchar(100),
age varchar(100),
address varchar(100),
year_of_residency varchar(100),
unwed_year varchar(100),
daughter_name varchar(100),
daughter_age varchar(100),
daughter_birthday varchar(100),
son_name varchar(100),
son_age varchar(100),
son_birthday varchar(100),
date_issued varchar(100),
transaction_number varchar(100),
is_active tinyint(1) DEFAULT 1,
date_created timestamp DEFAULT CURRENT_TIMESTAMP,
date_updated timestamp DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
);

CREATE TABLE bhert_normal(
id INT(11) NOT null AUTO_INCREMENT,
resident_id int(11),
name varchar(100),
address varchar(100),
request_hospital varchar(100),
date_issued varchar(100),
transaction_number varchar(100),
is_active tinyint(1) DEFAULT 1,
date_created timestamp DEFAULT CURRENT_TIMESTAMP,
date_updated timestamp DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
);
