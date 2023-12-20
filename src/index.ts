import express from 'express';
import { connection } from "./db";
import { log } from 'console';
import { z } from 'zod';
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
  
  const game = z.object({
    image: z.string().refine((value: string): boolean => value.includes('.jpg') || value.includes('.jpeg'), { message: 'Image must be of type .jpg or .jpeg'}),
    title: z.string().min(3, { message: 'Title must have at least 3 characters'}),
    genre: z.string().min(3, { message: 'Genre must have at least 3 characters'}),
    description: z.string().min(50, { message: 'Description must have at least 50 characters'}),
    rating: z.string().refine((value) => /^[1-5]$/.test(value), { message: 'Rating must be a single character between 1 and 5'}),
  })

  try {
    const validateData = game.parse({
      image,
      title,
      genre,
      description,
      rating
    });

  console.log('Validation sucessful', validateData)

    connection.query(query, [image, title, genre, description, rating], (error, results) => {
      if(error) {
        res.status(500).json({error: 'Internal server error'});
        return;
      };
  
      res.json({message: "Game created", results})
      }
    );
  } catch (error) {
    console.log('Validation failed', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/games/:id', async (req, res) => {
  const gameId = req.params.id;
  
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