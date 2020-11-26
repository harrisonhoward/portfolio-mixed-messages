async function startProgram() {
    let messages = Object.values(require("./messages.json"));
    const SQLiteManager = require("./sqlite");
    const SQL = new SQLiteManager();
    const title =
        "  _____                 _           _   _                   _    ____              _       \n" +
        " |_   _|               (_)         | | (_)                 | |  \/ __ \\            | |      \n" +
        "   | |  _ __  ___ _ __  _ _ __ __ _| |_ _  ___  _ __   __ _| | | |  | |_   _  ___ | |_ ___ \n" +
        "   | | | \'_ \\\/ __| \'_ \\| | \'__\/ _` | __| |\/ _ \\| \'_ \\ \/ _` | | | |  | | | | |\/ _ \\| __\/ _ \\\n" +
        "  _| |_| | | \\__ \\ |_) | | | | (_| | |_| | (_) | | | | (_| | | | |__| | |_| | (_) | ||  __\/\n" +
        " |_____|_| |_|___\/ .__\/|_|_|  \\__,_|\\__|_|\\___\/|_| |_|\\__,_|_|  \\___\\_\\\\__,_|\\___\/ \\__\\___|\n" +
        "                 | |                                                                       \n" +
        "                 |_|                                                                       ";

    // Initialise the database
    SQL.init();

    /*
        Get the previous message. If none then randomly print a new one.
        If there is one, remove it from the array
    */
    const previousMessage = await SQL.getQuote().catch(console.error);
    if (previousMessage != undefined) {
        messages = messages.filter(msg => msg.id !== (previousMessage.message_id + ""));
    }

    /*
        Get a random quote using the messages array
        Add that quote to the database
    */
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    SQL.addQuote(randomMessage.id, randomMessage.quote, randomMessage.author).catch(console.error);

    /*
        Display the quote
    */
    console.log(
        // Header
        `\n${title}\n\n` +
        // Quote
        `${randomMessage.quote}\n` +
        // Author
        `  - ${randomMessage.author}\n`
    );
}
startProgram();