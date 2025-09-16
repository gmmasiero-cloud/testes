import React, { useState } from 'react'

const questions = [
  {
    id: 1,
    text: 'Qual processo resulta em duas células filhas geneticamente idênticas à célula-mãe?',
    options: ['Meiose', 'Mitose'],
    answer: 'Mitose'
  },
  {
    id: 2,
    text: 'Qual processo reduz o número de cromossomos pela metade e gera variabilidade genética?',
    options: ['Mitose', 'Meiose'],
    answer: 'Meiose'
  },
  {
    id: 3,
    text: 'Em qual processo ocorre crossing-over durante a prófase I?',
    options: ['Meiose', 'Mitose'],
    answer: 'Meiose'
  }
]

export default function App() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  function choose(option) {
    if (option === questions[index].answer) setScore(s => s + 1)
    if (index + 1 < questions.length) setIndex(i => i + 1)
    else setFinished(true)
  }

  return (
    <div className="app">
      <h1>Quiz: Mitose e Meiose</h1>
      {!finished ? (
        <div className="card">
          <p className="question">{questions[index].text}</p>
          <div className="options">
            {questions[index].options.map(opt => (
              <button key={opt} onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
          <p className="progress">{index + 1} / {questions.length}</p>
        </div>
      ) : (
        <div className="result">
          <p>Você acertou {score} de {questions.length}.</p>
          <button onClick={() => { setIndex(0); setScore(0); setFinished(false); }}>Refazer</button>
        </div>
      )}
    </div>
  )
}