CREATE TABLE mask (
    id varchar(128) primary key not null,
    name varchar(255),
    avatar varchar(255),
    context varchar(4096),
    lang varchar(255),
    model_config varchar(255),
    user_id varchar(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workflow (
    id varchar(128) primary key not null,
    workflow text,
    user_id varchar(255),
    created_at TIMESTAMP DEFAULT NOW()
);