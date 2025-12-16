create extension if not exists citext;
create extension if not exists "uuid-ossp";
create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    email citext unique not null,
    password_hash text not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists notes (
    id uuid primary key default uuid_generate_v4(),
    parent_note_id uuid references notes(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    title text not null,
    content text not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);