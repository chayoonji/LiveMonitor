import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const LoginComponent = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 로그인 요청
            const response = await axios.post('http://localhost:3002/login', {
                userId,
                password,
            });

            // 로그인 성공 시, Context의 login 함수에 userId와 password를 전달
            if (response.data.success) {
                login(userId, password); // 비밀번호도 함께 전달
                navigate('/guide'); // 로그인 후 guide 페이지로 리다이렉트
            } else {
                alert('로그인 실패: 잘못된 아이디 또는 비밀번호');
            }
        } catch (error) {
            alert('로그인 중 오류가 발생했습니다');
            console.error('로그인 오류:', error);
        }
    };

    return (
        <div className="login-wrapper">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} id="login-form">
                <input
                    type="text"
                    name="userId"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required // 필수 입력 항목으로 설정
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required // 필수 입력 항목으로 설정
                />
                <div className="button-container">
                    <input type="submit" value="로그인" />
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;
