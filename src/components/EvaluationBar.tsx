import React from 'react';
import '../styles/EvaluationBar.css';

interface EvaluationBarProps {
  whiteEval: number; // centipawns
  blackEval: number;
}

const EvaluationBar: React.FC<EvaluationBarProps> = ({ whiteEval, blackEval }) => {
  const total = Math.abs(whiteEval) + Math.abs(blackEval);
  const whitePercentage = total === 0 ? 50 : (Math.abs(whiteEval) / total) * 100;

  const formatEval = (evaluationValue: number): string => {
    if (Math.abs(evaluationValue) > 10000) {
      return evaluationValue > 0 ? '+M' : '-M';
    }
    return (evaluationValue / 100).toFixed(2);
  };

  return (
    <div className="evaluation-bar-container">
      <div className="evaluation-bar">
        <div
          className="white-bar"
          style={{ width: `${whitePercentage}%` }}
        />
        <div
          className="black-bar"
          style={{ width: `${100 - whitePercentage}%` }}
        />
      </div>
      <div className="eval-values">
        <span className="white-eval">{formatEval(whiteEval)}</span>
        <span className="black-eval">{formatEval(blackEval)}</span>
      </div>
    </div>
  );
};

export default EvaluationBar;