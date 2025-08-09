create sequence user_seq
    increment by 50;

alter sequence user_seq owner to admin;

create sequence tl_user_seq
    increment by 50;

alter sequence tl_user_seq owner to admin;

create sequence tl_therapist_seq
    increment by 50;

alter sequence tl_therapist_seq owner to admin;

create sequence tl_contact_seq
    increment by 50;

alter sequence tl_contact_seq owner to admin;

create sequence tl_business_hours_seq
    increment by 50;

alter sequence tl_business_hours_seq owner to admin;

create table tl_contact
(
    id      bigint not null
        primary key,
    content varchar(255),
    date    timestamp(6),
    type    smallint
        constraint tl_contact_type_check
            check ((type >= 0) AND (type <= '-1'::integer))
);

alter table tl_contact
    owner to admin;

create table tl_user
(
    username varchar(255) not null
        primary key,
    password varchar(255),
    role     smallint
        constraint tl_user_role_check
            check ((role >= 0) AND (role <= 1)),
    tokens   varchar(255)[]
);

alter table tl_user
    owner to admin;

create table tl_therapist
(
    id             bigint not null
        primary key,
    address        varchar(255),
    email_address  varchar(255),
    name           varchar(255),
    notes          varchar(255),
    phone_number   varchar(255),
    rating         double precision,
    request_status smallint
        constraint tl_therapist_request_status_check
            check ((request_status >= 0) AND (request_status <= 4)),
    specialization varchar(255),
    waiting_time   timestamp(6),
    user_username  varchar(255)
        constraint fkgknx2cjuldjuexbximeu73eub
            references tl_user
);

alter table tl_therapist
    owner to admin;

create table tl_therapist_contact_history
(
    tl_therapist_id    bigint not null
        constraint fkn0cc8n4yw01gyv6p5d0uyj6b1
            references tl_therapist,
    contact_history_id bigint not null
        constraint uko5skdkqwxfirq7tc1575bv6mo
            unique
        constraint fkb95gvvqxl4p8w6tc361g4ov03
            references tl_contact,
    primary key (tl_therapist_id, contact_history_id)
);

alter table tl_therapist_contact_history
    owner to admin;

create table tl_business_hours
(
    id           bigint not null
        primary key,
    closing_time timestamp(6) with time zone,
    day_of_week  varchar(255),
    opening_time timestamp(6) with time zone
);

alter table tl_business_hours
    owner to admin;

create table tl_therapist_contact_times
(
    tl_therapist_id  bigint not null
        constraint fkgb475kjg6ml8496f48hnw2srx
            references tl_therapist,
    contact_times_id bigint not null
        constraint uk2l051ylgaru5dicd7ea0brol0
            unique
        constraint fktfi2ra3df22eehcus311fs2ig
            references tl_business_hours
);

alter table tl_therapist_contact_times
    owner to admin;

