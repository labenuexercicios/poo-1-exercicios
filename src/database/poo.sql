-- Active: 1698174101410@@127.0.0.1@3306

CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL, 
    duration INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos (id, title, duration) VALUES 
("v001","Galinha Pintadinha", 1025),
("v002","Baby Shark", 10225),
("v003","Bob Esponja",21025);

SELECT * FROM videos;
DROP TABLE videos;
