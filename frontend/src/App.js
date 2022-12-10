import { useEffect, useState } from 'react';
import './App.css';
import Result from './Result';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';

function App() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  let [secore, setSecore] = useState(0);
  let [questionNumber, setQuestionNumber] = useState(0);

  // Fetch Data
  const fetchData = async () =>
    await fetch('http://localhost:3000/words')
      .then((res) => res.json())
      .then((resData) => setData(resData));
  useEffect(() => {
    fetchData();
  }, []);

  // Check answer
  const checkAanswer = (element, correctAnswar) => {
    const prevSibling = element.parentElement.previousElementSibling;

    if (element.innerText === correctAnswar) {
      prevSibling.innerHTML = "<span class='correct'>Correct</span> " + prevSibling.innerText;
      setSecore(++secore);
    } else {
      prevSibling.innerHTML = "<span class='incorrect'>Incorrect</span> " + prevSibling.innerText;
    }

    element.parentElement.parentElement.classList.add('disabledElement'); // Disabled question after answered
    setQuestionNumber(++questionNumber); // Increment Answered Questions

    // Shows Next Question
    if (questionNumber < 10) {
      element.parentElement.parentElement.nextElementSibling.classList.remove('hidden');
    }

    // Nagitave to rank page
    if (questionNumber === 10) {
      navigate('/rank');
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Home data={data} questionNumber={questionNumber} checkAanswer={checkAanswer} />}
        ></Route>
        <Route path="/rank" element={<Result secore={secore} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
