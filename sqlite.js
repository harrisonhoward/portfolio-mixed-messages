const sqlite3 = require("sqlite3");

module.exports = class SQLiteManager {
    constructor() {
        this.db = new sqlite3.Database("./previous.sqlite");
    }

    init() {
        this.db.serialize(() => {
            this.db.run(
                "CREATE TABLE IF NOT EXISTS Previous (" +
                "id INTEGER NOT NULL," +
                "message_id INTEGER NOT NULL," +
                "quote TEXT NOT NULL," +
                "author TEXT NOT NULL," +
                "PRIMARY KEY (id)" +
                ")"
            );
        });
    }

    getQuote() {
        return new Promise((resolve, reject) => {
            this.db.get(
                "SELECT * FROM Previous WHERE id = 1",
                (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row);
                }
            );
        });
    }

    addQuote(id, quote, author) {
        return new Promise(async (resolve, reject) => {
            const previous = this.getQuote();
            if (previous) {
                this.db.run(
                    "UPDATE Previous SET message_id = $messageId, quote = $quote, author = $author " +
                    "WHERE id = 1",
                    {
                        $messageId: id,
                        $quote: quote,
                        $author: author
                    },
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    }
                );
            } else {
                this.db.run(
                    "INSERT INTO Previous (id, message_id, quote, author) " +
                    "VALUES (1, $messageId, $quote, $author)",
                    {
                        $messageId: id,
                        $quote: quote,
                        $author: author
                    },
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    }
                );
            }
        });
    }
}