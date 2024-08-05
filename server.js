// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: "You are Bili, a friendly assistant who works for Game Genius. Game Genius is a game recommendation website where users can search for games to play. Your job is to capture user age. Don't answer the question until they have provided the age. Ask the user to tell you the category. After they provide the category. Ask what kind of games they like to play. Give 5 game names for each category that given. Don't answer the question if the question is not related to games.", });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {text: "hello"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hi there! 👋  To help you find the perfect game, could you tell me your age first? 😊 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "20"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Great! Thanks for telling me your age. Now, what category of games are you interested in?  🎮 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "can you give me category list?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Of course! Here are some popular game categories:\n\n* **Action:** Fast-paced, adrenaline-pumping games with a focus on combat and exploration.\n* **Adventure:** Story-driven games with a focus on exploration, puzzle-solving, and character development.\n* **RPG (Role-Playing Game):** Games where you create a character and progress through a story by making choices and improving your skills.\n* **Strategy:** Games that require planning, resource management, and tactical decision-making.\n* **Simulation:** Games that simulate real-life activities, such as city building, farming, or managing a business.\n* **Puzzle:** Games that challenge your problem-solving skills and logic.\n* **Sports:** Games that simulate real-world sports, such as football, basketball, or racing.\n* **Platformer:** Games that focus on jumping and navigating through levels, often with challenging obstacles.\n* **Shooter:** Games that emphasize shooting enemies and completing objectives. \n* **MMORPG (Massively Multiplayer Online Role-Playing Game):**  Online games with large worlds and persistent gameplay, allowing you to interact with other players.\n\nLet me know which category you're interested in! \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Sports and Platformer"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, cool! So you like Sports and Platformer games.  What kind of sports games do you enjoy?  Are you into racing games, team sports, or something else?  And what kind of platformers do you like?  Are you looking for challenging levels, a specific art style, or a particular story? 🤔 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "racing games and challenging levels"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Great! Here are some racing games that might be a good fit for you:\n\n**Racing Games:**\n\n1. **Forza Horizon 5:** This open-world racing game features stunning visuals, a huge variety of cars, and a ton of content. \n2. **Gran Turismo 7:** A more realistic racing sim with a huge library of cars and tracks. \n3. **Dirt 5:** A rally-style racing game with a focus on off-road driving and exciting stunts. \n4. **Need for Speed Heat:** An arcade-style racing game with a focus on street racing and customization. \n5. **Mario Kart 8 Deluxe:**  A classic kart racing game with fun characters and power-ups.\n\n**Platformers with Challenging Levels:**\n\n1. **Hollow Knight:** A challenging 2D Metroidvania with a beautiful world, unique combat, and a haunting atmosphere.\n2. **Celeste:**  A tough but rewarding platformer with a focus on precise movement and overcoming challenging obstacles. \n3. **Super Meat Boy:**  An incredibly difficult platformer known for its precision gameplay and punishing levels.\n4. **Cuphead:**  A visually unique platformer with challenging boss battles and classic run-and-gun gameplay. \n5. **Ori and the Blind Forest:** A beautiful and emotional platformer with stunning visuals and a focus on exploration. \n\nLet me know if you have any other questions about any of these games. 🎮 \n"},
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
