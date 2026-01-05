// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from 'react';
import { WORDS } from './words'; // Import words from a separate file
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const MONGOLIAN_LETTERS = [
  ['ф', 'ц', 'у', 'ж', 'э', 'н', 'г', 'ш', 'ү', 'з', 'к', 'ъ'],
  ['й', 'ы', 'б', 'ө', 'а', 'х', 'р', 'о', 'л', 'д', 'п'],
  ['я', 'ч', 'ё', 'с', 'м', 'и', 'т', 'ь', 'в', 'ю']
];

const getRandomWord = () => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

const WordleGame = () => {
  const [word, setWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [submittedGuesses, setSubmittedGuesses] = useState([]);
  const [warning, setWarning] = useState('');
  const [rolling, setRolling] = useState(false);
  const [newGuess, setNewGuess] = useState('');
  const [instructionsOpen, setInstructionsOpen] = useState(false); // State for dialog

  const handleKeyPress = (event) => {
    if (gameOver) return;

    if (event.key === 'Enter') {
      submitGuess();
    } else if (event.key === 'Backspace') {
      handleDelete();
    } else if (currentGuess.length < 5 && /^[a-zA-Zа-яА-Я]$/.test(event.key)) {
      const newGuess = currentGuess + event.key.toLowerCase();
      setCurrentGuess(newGuess);
      const newGuesses = [...guesses];
      newGuesses[currentRow] = newGuess;
      setGuesses(newGuesses);
      setCurrentGuess(newGuess);
      setNewGuess(newGuess);
    }
  };

  const handleLetterClick = (letter) => {
    if (currentGuess.length < 5) {
      const newGuess = currentGuess + letter;
      setCurrentGuess(newGuess);
      const newGuesses = [...guesses];
      newGuesses[currentRow] = newGuess;
      setGuesses(newGuesses);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length === 5) {
      setWarning('');
      setRolling(true);
      setTimeout(() => {
        const newGuesses = [...guesses];
        newGuesses[currentRow] = currentGuess;
        setGuesses(newGuesses);

        const newDisabledLetters = [...disabledLetters];
        currentGuess.split('').forEach((letter, index) => {
          if (!word.includes(letter)) {
            newDisabledLetters.push(letter);
          }
        });
        setDisabledLetters(newDisabledLetters);

        setSubmittedGuesses([...submittedGuesses, currentGuess]);
        setCurrentGuess('');
        setCurrentRow(currentRow + 1);

        if (currentGuess === word || currentRow === 5) {
          setGameOver(true);
        }
        setRolling(false);
      }, 1000);
    } else {
      setWarning('Please enter 5 letters.');
    }
  };

  const handleDelete = () => {
    const newGuess = currentGuess.slice(0, -1);
    setCurrentGuess(newGuess);
    const newGuesses = [...guesses];
    newGuesses[currentRow] = newGuess;
    setGuesses(newGuesses);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentGuess, currentRow, gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0', cursor: 'url(judgeCursor.png), auto' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>🧑‍⚖️ Алхан Тоглоом</h1>
        <Button
          variant="outlined"
          onClick={() => setInstructionsOpen(true)}
          style={{ marginBottom: '20px' }}
        >
          ❓ Тоглоомын заавар
        </Button>
        <div>
          {guesses.map((guess, index) => (
            <div key={index} style={{ display: 'flex' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 50,
                    height: 50,
                    border: '2px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 2,
                    borderRadius: 5,
                    backgroundColor:
                      submittedGuesses.includes(guess) && guess[i] === word[i]
                        ? 'green'
                        : submittedGuesses.includes(guess) && word.includes(guess[i])
                        ? 'yellow'
                        : 'white',
                    color: 'black',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    transition: rolling && index === currentRow ? 'transform 0.5s' : 'none',
                    transform: rolling && index === currentRow ? 'rotateX(360deg)' : 'none',
                  }}
                >
                  {guess[i]}
                </div>
              ))}
            </div>
          ))}
        </div>
        {warning && <div style={{ color: 'red', marginTop: '10px' }}>{warning}</div>}
        {gameOver && (
          <div>
            <h2>{submittedGuesses[currentRow - 1] === word ? 'Баяр хүргэе!' : 'Тоглоом дууслаа!'}</h2>
            <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', fontSize: '1em', borderRadius: '10px' }}>Дахин тоглох</button>
          </div>
        )}
      </div>

      {/* Instructions Dialog */}
      <Dialog open={instructionsOpen} onClose={() => setInstructionsOpen(false)}>
        <DialogTitle>Тоглоомын заавар</DialogTitle>
        <DialogContent>
          <p>
            <strong>ТОГЛООМЫН ДҮРЭМ</strong>
            <br />
            Танд ҮГ таах 6 удаагийн оролдлого байна.
            <br />
            • Өдрийн таах үг нэг мөр дэх дөрвөлжингийн тоотой тэнцүү үсэгтэй байна.
            <br />
            • Дөрвөлжингийн өнгө таны таасан үсгийн өнгөөр өөрчлөгдөнө.
            <br />
            Жишээ нь:
          </p>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '5px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'green', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>М</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>О</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Н</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Г</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>О</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Л</div>
            </div>
            <p>М үсэг зөв байрласан учраас ногоон өнгө гасан байна.</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '5px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>А</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Г</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>А</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>А</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Р</div>
            </div>
            <p>Г үсэг энэ үгэнд орсон боловч буруу байрласан тул шар өнгө гарсан байна.</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '5px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Х</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>У</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>У</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'gray', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Л</div>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'gray', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}>Ь</div>
            </div>
            <p>Л болон Ь үсэг энэ үгэнд ороогүй байх тул саарал өнгөтэй болсон байна.</p>
          </div>
          <p>
            Өдөр бүр шинэ үг өөрчлөгдөх бөгөөд та и-мэйл хаягаа бүртгүүлэн сануулсан зурвас авах боломжтой.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstructionsOpen(false)}>Хаах</Button>
        </DialogActions>
      </Dialog>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {MONGOLIAN_LETTERS.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              {row.map((letter, index) => (
                <div
                  key={index}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '2px',
                    backgroundColor: disabledLetters.includes(letter) ? '#d3d3d3' : '#fff',
                    color: 'black',
                    fontSize: '1.2em',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleDelete} style={{ padding: '10px 20px', fontSize: '1em', marginRight: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px' }}>⌫</span> Устгах
          </button>
          <button onClick={submitGuess} style={{ padding: '10px 20px', fontSize: '1em', borderRadius: '10px' }}>Оруулах</button>
        </div>
      </div>
    </div>
  );
};

export default WordleGame;
