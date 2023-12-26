import { useEffect } from 'react';
import React, {useState} from 'react';

export default function Input() {
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log(`${input} is the current input`);
  }, [input]);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => setInput('')}>Clear</button>
      <p>{input}</p>
    </div>
  );
}
