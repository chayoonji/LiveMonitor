![KKHC Logo](/images/logo.ico)  <!-- KKHC의 로고 이미지 경로 -->

<br>

# 🛠️ 서버 취약점 진단 웹사이트 (KKHC)

서버 취약점 진단을 요청하고 결과값을 그래프, 표로 볼 수 있고 PDF 파일을 다운로드 받을 수 있는 웹 사이트를 **React + Vite / Express + Node.js + MongoDB**로 구현하였습니다.

<br>

## 📜 프로젝트 소개

KISA 한국인터넷진흥원에서 매년 올려주는 주요정보통신기반시설 기술적 취약점 분석 평가 상세 가이드를 기준으로 고객 서버의 관리자 ID, PW, IP주소 등을 입력 받아 원격 접속하여 취약점을 진단하는 프로그램입니다. 결과값은 웹에서 표와 그래프, PDF 파일로 제공됩니다.

<br>

## 📅 개발 기간

- **2024.03.04 (월) ~ 2024.10.18 (금)**: 주제 선정, 자료 조사, 프로그램 개발, 발표

<br>

## 👩‍💻 개발자 소개

- **김솔**: 팀장, Linux 취약점 진단 스크립트 개발
- **홍예진**: Linux 메모리 사용률 진단 스크립트 개발
- **강채린**: 프론트 & 백엔드 개발자
- **차윤지**: 프론트 & 백엔드 개발자

<br>

# 💻 개발환경 

<br>

### 🖥️ 가상화 소프트웨어

- **VMware Workstation** (버전 17.x)  
- **VM 설정**: 동일한 하드웨어 및 소프트웨어 환경  

<br>

### 🛠️ 운영체제

- **Fedora Linux 38 (x86_64)**  
- **네트워크 설정**: NAT  

<br>

### 💻 터미널 (Windows에서 원격 접속)

- **SSH 클라이언트**: Xshell  

<br>

# ⚙️ 기술 스택

- **Frontend**: React, Vite  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Shell 및 Atlas)  

<br>

# 🧪 테스트 환경

관리자와 고객 모두 동일한 VM 환경을 사용합니다.

### VM 설정
- 동일한 하드웨어, 소프트웨어 및 진단 도구 설치

<br>
  
- **MongoDB Shell 설치**:
    > ```bash
    > sudo dnf install mongodb-shell
    > ```

<br>

### 웹 실행 방법
1. **프론트엔드**:
    - `npm install`
    - `npm run dev`
  
<br>

2. **백엔드**:
    - `cd server`
    - `npm install`
    - `.env` 파일 추가 후 `npm start`

<br>

# 🔑 Google 앱 비밀번호 설정 방법

`NODE_MAILER_PASSWORD`에 입력할 앱 비밀번호를 Google에서 생성하려면, 다음 단계를 따르세요:

<br>

1. **Google 계정에 로그인**합니다.  
   - [Google 계정 로그인](https://myaccount.google.com)

<br>

2. **2단계 인증을 설정**합니다.  
   - Google 계정의 **보안** 탭에서 **2단계 인증**을 활성화해야 합니다.  

<br>

3. **앱 비밀번호 생성**:  
   - 2단계 인증이 완료된 후, 다시 **Google 계정의 보안 탭**으로 이동합니다.  
   - **앱 비밀번호** 섹션에서 앱 비밀번호를 생성합니다.  
   - [앱 비밀번호 생성 링크](https://myaccount.google.com/apppasswords)

<br>

4. **앱 및 기기 선택**:  
   - 앱 비밀번호 생성 페이지에서 "메일" 앱과 사용하는 "기기"를 선택한 후 **생성** 버튼을 클릭합니다.  
   - 생성된 16자리 앱 비밀번호를 **NODE_MAILER_PASSWORD**에 입력합니다.

<br>

> **참고**: Google은 기본적으로 외부 애플리케이션에서 이메일 전송을 차단하므로, 앱 비밀번호를 사용하여 외부 애플리케이션에서도 메일 기능을 활성화할 수 있습니다.

<br>

# 🛠️ 환경 변수 (.env 파일)

다음은 백엔드 서버의 `.env` 파일에 포함되어야 할 주요 환경 변수입니다:

- **PORT**: 서버가 실행되는 포트 번호 (기본: 3002)
- **SESSION_SECRET**: 세션 관리를 위한 비밀 
- **DB_URL**: MongoDB 데이터베이스 연결 URI
- **NODE_MAILER_ID**: 이메일 발송을 위한 메일 계정 
- **NODE_MAILER_PASSWORD**: 구글 계정에서 생성한 앱 비밀번호 
- **VM_HOST**: 원격 접속을 위한 VM 호스트 IP 주소
- **VM_USERNAME**: VM 사용자명
- **VM_PRIVATE_KEY_PATH**: SSH 접속을 위한 개인 키 경로
- **LINUX_PASSWORD**: Linux 원격 접속용 비밀번호
- **JWT_SECRET**: JWT 토큰 생성을 위한 비밀 키
- **ADMIN_USER_ID**: 관리자로 설정할 ID (예: test123)

<br>

```plaintext
# 예시 .env 파일

PORT=3002
SESSION_SECRET=your_session_secret
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/접속하려는 DB이름?retryWrites=true&w=majority&appName=Cluster0
NODE_MAILER_ID=your_email@example.com
NODE_MAILER_PASSWORD=your_email_password
VM_HOST=your_vm_host_ip
VM_USERNAME=your_vm_username
VM_PRIVATE_KEY_PATH=/path/to/your/private_key
LINUX_PASSWORD=your_linux_password
JWT_SECRET=your_jwt_secret
ADMIN_USER_ID=your_admin_user_id
