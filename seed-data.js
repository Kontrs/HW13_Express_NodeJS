const mysql = require('mysql2');
const DB_NAME = 'my_first_database'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS games (
          id INT AUTO_INCREMENT PRIMARY KEY,
          image VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          genre VARCHAR(255) NOT NULL,
          description VARCHAR(1000) NOT NULL,
          rating VARCHAR(255) NOT NULL
        )
      `;

      // Execute the query to create the table
      connection.query(createTableQuery, (createTableError, createTableResults) => {
        if (createTableError) {
          console.error('Error creating table:', createTableError);
          connection.end();
          return;
        }

        console.log('Table "games" created or already exists');

        // Define the SQL query to insert data into the table
        const insertDataQuery = `
          INSERT INTO games (image, title, genre, description, rating) VALUES
            ('src/assets/images/league-of-legends.jpg', 'League of Legends', 'Multiplayer Online Battle Arena', 'League of Legends is a multiplayer online battle arena (MOBA) game in which the player controls a character champion with a set of unique abilities from an isometric perspective. As of 2023, there are over 160 champions available to play', '5'),
            ('src/assets/images/apex-legends.jpg', 'Apex Legends', 'Battle royale', 'Apex Legends is an online multiplayer battle royale game featuring squads of three players using pre-made characters with distinctive abilities, called Legends, similar to those of hero shooters. Alternate modes have been introduced allowing for single and for two-player squads since the games release', '5'),
            ('src/assets/images/god-of-war.jpg', 'God of War', 'Action-adventure, hack and slash', 'In God of War, players control Kratos, a Spartan warrior who is sent by the Greek gods to kill Ares, the god of war. As the story progresses, Kratos is revealed to be Ares former servant, who had been tricked into killing his own family and is haunted by terrible nightmares', '5')
        `;

        // Execute the query to insert data
        connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
          if (insertDataError) {
            console.error('Error inserting data:', insertDataError);
          } else {
            console.log('Data inserted or already exists');
          }

          // Close the connection
          connection.end();
        });
      });
    });
  });
});
