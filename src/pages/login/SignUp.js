import React, { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import Header from "../../components/ui/Header";

const SignUp = () => {
  const [memberId, setMemberId] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [memberPassWord, setMemberPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [memberTel, setMemberTel] = useState("");
  const [memberStudentNumber, setMemberStudentNumber] = useState("");
  const [memberBirthDate, setMemberBirthdate] = useState("");
  const [memberSex, setMemberSex] = useState("true");

  const baseUrl = "http://localhost:8080";

  // ID 중복체크 메서드
  const checkIdAvailability = async () => {
    try {
      const response = await axios.post(`${baseUrl}/member/idCheck`, null, {
        params: { memberId },
      });
      setIsIdAvailable(response.data);
    } catch (error) {
      console.error("ID 중복 체크 실패:", error);
    }
  };

  // 비밀번호 일치 검사
  const handlePasswordChange = (e) => {
    setMemberPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === memberPassWord);
  };

  const handleNameChange = (e) => {
    setMemberName(e.target.value);
  };

  // 이메일 형식 유효성 검사
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    const email = e.target.value.trim();
    setMemberEmail(email);
    setEmailError(validateEmail(email) ? "" : "유효한 이메일 형식이 아닙니다.");
  };

  // 회원가입 버튼 클릭 시 모든 데이터 전송
  const handleSignUp = async (e) => {
    e.preventDefault();

    // 공백 및 기타 유효성 검사
    if (!memberId || !memberPassWord || !confirmPassword || !memberName || !memberEmail || !memberTel || !memberStudentNumber || !memberBirthDate) {
      alert("모든 필드를 정확히 입력해주세요.");
      return;
    }

    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (emailError) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    if (!/^\d{8}$/.test(memberStudentNumber)) {
      alert("학번은 8자리 숫자만 입력해주세요.");
      return;
    }

    if (!/^\d+$/.test(memberTel)) {
      alert("전화번호는 숫자만 입력해주세요.");
      return;
    }

    const requestData = {
      memberId,
      memberPassWord,
      memberName,
      memberEmail,
      memberTel,
      memberStudentNumber,
      memberBirthDate,
      memberSex,
    };

    try {
      const response = await axios.post(`${baseUrl}/member/join`, requestData);
      alert("회원가입이 완료되었습니다!");
      navigator("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      // alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Sign Up</h1>
        <form className={styles.form} onSubmit={handleSignUp}>
          {/* ID 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberId">아이디</label>
            <div className={styles.idCheckContainer}>
              <input type="text" id="memberId" value={memberId} onChange={(e) => setMemberId(e.target.value.trim())} className={styles.input} placeholder="아이디를 입력하세요" disabled={isIdAvailable === true} />
              <button type="button" onClick={checkIdAvailability} className={styles.idCheckButton} disabled={memberId.trim() === ""}>
                중복확인
              </button>
            </div>
            {isIdAvailable === true && <p className={styles.successMessage}>사용 가능한 아이디입니다.</p>}
            {isIdAvailable === false && <p className={styles.errorMessage}>이미 사용 중인 아이디입니다.</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberPassword">비밀번호</label>
            <input type="password" id="memberPassword" value={memberPassWord} onChange={handlePasswordChange} className={styles.input} placeholder="비밀번호를 입력하세요" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className={styles.input} placeholder="비밀번호를 다시 입력하세요" />
            {!passwordMatch && <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}
          </div>

          {/* 이름 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberName">이름</label>
            <input type="text" id="memberName" value={memberName} onChange={handleNameChange} className={styles.input} placeholder="이름을 입력하세요" />
          </div>

          {/* 이메일 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberEmail">이메일</label>
            <input type="email" id="memberEmail" value={memberEmail} onChange={handleEmailChange} className={styles.input} placeholder="이메일을 입력하세요" />
            {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          </div>

          {/* 전화번호 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberTel">전화번호</label>
            <input type="tel" id="memberTel" value={memberTel} onChange={(e) => setMemberTel(e.target.value.trim())} className={styles.input} placeholder="전화번호를 입력하세요 (숫자만 입력)" />
          </div>

          {/* 학번 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberStudentNumber">학번</label>
            <input type="text" id="memberStudentNumber" value={memberStudentNumber} onChange={(e) => setMemberStudentNumber(e.target.value.trim())} className={styles.input} placeholder="학번을 입력하세요 (8자리 숫자)" />
          </div>

          {/* 생년월일 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberBirthdate">생년월일</label>
            <input type="date" id="memberBirthdate" value={memberBirthDate} onChange={(e) => setMemberBirthdate(e.target.value)} className={styles.input} />
          </div>

          {/* 성별 입력 */}
          <div className={styles.formGroup}>
            <label htmlFor="memberSex">성별</label>
            <select id="memberSex" value={memberSex} onChange={(e) => setMemberSex(e.target.value)} className={styles.input}>
              <option value="true">남</option>
              <option value="false">여</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isIdAvailable === null || isIdAvailable === false}>
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
