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

const QuizApp: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(quizData.length).fill(null)
  );
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setQuizFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswerClick = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
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

  if (quizFinished) {
    return (
      <div className="container text-center mt-5">
        <h2>Quiz Finished!</h2>
        <p>
          Your score: {calculateScore()} / {quizData.length}
        </p>
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
        className="btn btn-secondary mt-3 mx-2"
        onClick={handleNextQuestion}
      >
        {currentQuestion === quizData.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default QuizApp;
