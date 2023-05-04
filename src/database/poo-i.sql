-- Active: 1683225897390@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    upload_date TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos(id, title, duration)
VALUES
    ("v001", "Introdução ao React", 1000),
    ("v002", "Introdução ao Typescript", 2000);

SELECT * FROM videos;