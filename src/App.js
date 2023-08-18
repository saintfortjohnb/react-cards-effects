import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import './App.css';

function App() {
  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    async function createDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
      const data = await response.json();
      setDeck(data);
    }

    createDeck();
  }, []);

  useEffect(() => {
    return () => {
      if (drawInterval.current) {
        clearInterval(drawInterval.current);
      }
    };
  }, []);  

  const drawInterval = useRef(null);

  async function fetchCard() {
    if (deck) {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
      const data = await response.json();
      setCard(data.cards[0]);
      setDeck(data);
      checkDeckExhaustion(data);
    }
  }
  
  function checkDeckExhaustion(data) {
    if (data.remaining === 0) {
      clearInterval(drawInterval.current);
      setIsDrawing(false);
      alert('Error: no cards remaining!');
    }
  }
  
  async function drawCard() {
    if (isDrawing) {
      clearInterval(drawInterval.current);
      setIsDrawing(false);
    } else {
      drawInterval.current = setInterval(() => {
        fetchCard();
      }, 1000);
      setIsDrawing(true);
    }
  }  

  async function shuffleDeck() {
    setLoading(true);
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
    const data = await response.json();
    setDeck(data);
    setCard(null);
    setLoading(false);
  }

  return (
    <div className="App">
      <Button onClick={drawCard} disabled={loading}>
        {isDrawing ? "Stop drawing" : "Start drawing"}
      </Button>
      <Button onClick={shuffleDeck} disabled={loading}>Shuffle Deck</Button>
      {card && <Card image={card.image} value={card.value} suit={card.suit} />}
    </div>
  );
}

export default App;
