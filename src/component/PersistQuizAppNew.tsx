import React, { useState, useEffect } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

const quizData: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "Which is the largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Jupiter",
  },
];

const TOTAL_TIME = 30; // Total time for the quiz in seconds

const PersistQuizAppNew: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(() => {
    return Number(localStorage.getItem("currentQuestion")) || 0;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return Number(localStorage.getItem("timeLeft")) || TOTAL_TIME;
  });
  const [answers, setAnswers] = useState<(string | null)[]>(() => {
    const storedAnswers = localStorage.getItem("answers");
    return storedAnswers
      ? JSON.parse(storedAnswers)
      : new Array(quizData.length).fill(null);
  });
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setQuizFinished(true);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem("timeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion.toString());
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [currentQuestion, answers]);

  const handleAnswerClick = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion] !== null) {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizFinished(true);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((acc, answer, index) => {
      return answer === quizData[index].answer ? acc + 1 : acc;
    }, 0);
  };

  const attendedQuestions = answers.filter((answer) => answer !== null).length;
  const skippedQuestions = quizData.length - attendedQuestions;

  if (quizFinished) {
    localStorage.clear();
    return (
      <div className="container text-center mt-5">
        <h2>Quiz Finished!</h2>
        <p>
          Your score: {calculateScore()} / {quizData.length}
        </p>
        <p>Questions attempted: {attendedQuestions}</p>
        <p>Questions skipped: {skippedQuestions}</p>
        <h3>Correct Answers:</h3>
        <ul>
          {quizData.map((q, index) => (
            <li key={index}>
              {q.question} - <strong>{q.answer}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h2>Quiz App</h2>
      <p>Time left: {timeLeft}s</p>
      <h4>{quizData[currentQuestion].question}</h4>
      <div>
        {quizData[currentQuestion].options.map((option) => (
          <button
            key={option}
            className={`btn btn-primary m-2 ${
              answers[currentQuestion] === option ? "btn-success" : ""
            }`}
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="btn btn-secondary mt-3 mx-2"
        onClick={handlePrevQuestion}
        disabled={currentQuestion === 0}
      >
        Previous
      </button>
      <button
        className="btn btn-warning mt-3 mx-2"
        onClick={handleSkipQuestion}
      >
        Skip
      </button>
      <button
        className="btn btn-secondary mt-3 mx-2"
        onClick={handleNextQuestion}
        disabled={answers[currentQuestion] === null}
      >
        {currentQuestion === quizData.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default PersistQuizAppNew;
