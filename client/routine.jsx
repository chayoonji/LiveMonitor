import React from 'react';
import { Link } from 'react-router-dom';

const Routine = () => {
  return (
    <div>
      <h2>Routine Page</h2>
      {/* 진단요청 버튼 */}
      <Link to="/board">
        <button>진단요청</button>
      </Link>
    </div>
  );
};

export default Routine;