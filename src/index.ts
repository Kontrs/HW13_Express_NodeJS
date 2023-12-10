import express from 'express';
import { connection } from "./db";
import { log } from 'console';
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());

app.use(cors({
  origin: '*'
}));

app.get('/games', async (req, res) => {
  // Execute the query to get all games
  connection.query('SELECT * FROM games', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the games as a JSON response
    res.json(results);
  });
});

app.post('/game', async (req, res) => {
  const {image, title, genre, description, rating} = req.body;
  const query = `
    INSERT INTO games (image, title, genre, description, rating)
    VALUES (?, ?, ?, ?, ?);
  `;

  if (!image || !title || !genre || !description || !rating) {
    res.status(400).send('Invalid data');
    return;
  };

  connection.query(query, [image, title, genre, description, rating], (error, results) => {
    if(error) {
      res.status(500).json({error: 'Internal server error'});
      return;
    };

    res.json({message: "Game created", results})
    }
  );
});

app.delete('/games/:id', async (req, res) => {
  const gameId = req.params.id;
  console.log(gameId);
  
  connection.query('DELETE from games where id = ?', [gameId], (error, results) => {
    if(error) {
      res.status(500).json({error: 'Internal server error'});
      return;
    };
    res.json({message: "Game deleted", results});
    }
  );
});

app.patch('/games/:id', async (req, res) => {
  const gameId = req.params.id;
  const {title, genre, description, rating} = req.body;
  console.log(gameId);
  connection.query(
    'UPDATE games SET title = ?, genre = ?, description = ?, rating = ? where id = ?',
    [title, genre, description, rating, gameId],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      };
      res.json({ message: 'Game updated', results });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 