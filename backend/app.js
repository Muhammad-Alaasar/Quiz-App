const express = require('express');
const cors = require('cors');
const dataFn = require('./dataFunctions');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Welcome to TestAPI'));
app.listen(port, () => console.log(`Server Running Now On http://localhost:${port}`));

const { wordList, scoresList } = dataFn();

// Select Random Numbers from 1 to 15
let words = [];

const getWords = () => {
  let randomNumbers = [];
  for (let n = 0; randomNumbers.length < 10; n++) {
    let num = Math.round(Math.random() * 15);
    if (randomNumbers.some((i) => i === num) || num === 0) continue;
    randomNumbers.push(num);
  }

  words = wordList.filter((w) => {
    return randomNumbers.find((n) => n === w.id);
  });
};

// Words Endpoint
app.get('/words', (req, res) => {
  try {
    let adverb, verb, noun, adjective;

    while (!adverb || !verb || !noun || !adjective) {
      getWords();
      adverb = words.some((q) => q.pos === 'adverb');
      verb = words.some((q) => q.pos === 'verb');
      noun = words.some((q) => q.pos === 'noun');
      adjective = words.some((q) => q.pos === 'adjective');
    }
    res.send(words);
  } catch (error) {
    res.send(error);
  }
});

// Rank Endpoint
app.post('/rank', (req, res) => {
  try {
    const rank = scoresList.filter((s) => s < req.body.result * 10);
    res.send({ rank: rank.length });
  } catch (error) {
    res.send(error);
  }
});
