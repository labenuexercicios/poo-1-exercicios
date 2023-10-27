-- Active: 1673873944178@@127.0.0.1@3306

CREATE TABLE videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    upload_date TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos (id, title, duration)
VALUES
    ("v001", "Video 1", 2.45),
    ("v002", "Video 2", 0.26),
    ("v003", "Video 3", 13.27);

SELECT * FROM videos;

DROP TABLE videos;