CREATE TABLE mask (
    id varchar(128) primary key not null,
    name varchar(255),
    avatar varchar(255),
    context varchar(255),
    lang varchar(255),
    userId varchar(255),
    created_at TIMESTAMP DEFAULT NOW()
);