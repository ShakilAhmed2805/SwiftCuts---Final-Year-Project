create table users(
id INT PRIMARY KEY auto_increment,
first_name VARCHAR(100) not null,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(500) NOT NULL,
mobile VARCHAR(20),
dob DATE,
age INT,
address varchar(100),
city VARCHAR(50),
post_code VARCHAR(10),
last_login datetime,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT current_timestamp on update current_timestamp
);

CREATE USER 'swiftcuts'@'localhost' identified BY 'swiftcuts';
GRANT ALL privileges on swiftcuts.* to 'swiftcuts'@'localhost';

use swiftcuts;
ALTER USER 'swiftcuts'@'localhost' IDENTIFIED WITH mysql_native_password BY 'swiftcuts';


use swiftcuts;
create table salons(
id INT NOT NULL auto_increment,
name VARCHAR(255) NOT NULL,
address VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
state VARCHAR(2) NOT NULL,
postcode VARCHAR(10) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id)
);

use swiftcuts;
CREATE TABLE appointments(
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  salon_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (salon_id) REFERENCES salons(id)
);

