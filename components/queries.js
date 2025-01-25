export const create_table = `
CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT,
    title_ja TEXT,
    page TEXT,
    poster TEXT,
    preview TEXT,
    poster_thumb TEXT,
    director TEXT,
    release_date TEXT,
    runtime INTEGER,
    studio TEXT,
    screenshots TEXT,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS actresses (
    id INTEGER PRIMARY KEY,
    name TEXT,
    image TEXT
);

CREATE TABLE IF NOT EXISTS movie_actresses (
    movie_id TEXT,
    actress_id INTEGER,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (actress_id) REFERENCES actresses(id),
    PRIMARY KEY (movie_id, actress_id)
);

`
insert_movie = (id, title, title_ja, page, poster, preview, poster_thumb, director, release_date, runtime, studio, screenshots,tags)=>  (`
    INSERT INTO movies (id, title, title_ja, page, poster, preview, poster_thumb, director, release_date, runtime, studio, screenshots,tags)
VALUES (
    ?,?,?,?,?,?,?,?,?,?,?,?,?
)`)

insert_actress = (id, name, image)=>(`
    INSERT INTO actresses (id, name, image)
VALUES (28071, 'Eri Takigawa', 'https://pics.dmm.co.jp/mono/actjpgs/arisawa_misa.jpg');
`)

insert_movie_actress = (movie_id, actress_id)=>(
    `
    INSERT INTO movie_actresses (movie_id, actress_id)
VALUES ('OBA-411', 28071);
    `
)

