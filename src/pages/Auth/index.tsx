import { useRef, useState } from "react";
import { emailValidator } from "../../utils";
import { AUTH } from "../../context/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../../components/ui/TextInput";

const AuthPage = () => {
  const isNew = useSearchParams()[0].get("content");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [jobDesc, setJobDesc] = useState(AUTH.UserJob | "");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLSelectElement>(null);
  const jobDescRef = useRef<HTMLInputElement>(null);

  const { signin, signup } = AUTH.use();

  const navi = useNavigate();

  const onSubmit = async () => {
    if (isNew) {
      if (name.length === 0) {
        alert("이름 입력");
        return nameRef.current?.focus();
      }
      if (jobDesc.length === 0) {
        alert("종사직종 선택");
        return jobDescRef.current?.showPicker();
      }
    }
    const isEmail = emailValidator(email);
    if (!isEmail) {
      alert("이메일 확인");
      return emailRef.current?.focus();
    }
    if (password.length < 6 || password.length > 18) {
      alert("비번확인 6~18글자 사이");
      return passwordRef.current?.focus();
    }

    if (!isNew) {
      const { success, message } = await signin(email, password);
      if (!success) {
        if (message === "존재하지 않는 유저") {
          if (confirm(message + "" + "회원가입 하시겠습니까?")) {
            navi("/signin?content=new");
            return setTimeout(() => {
              nameRef.current?.focus();
            }, 500);
          }
        }
      }
      alert("환영합니다");
      navi("/project");
      return;
    }
    const { success, message } = await signup({
      email,
      jobDesc,
      name,
      password,
    });
    if (!success) {
      return alert(message);
    }
    alert("회원가입 진심으로 축하드립니다. 프로젝트를 생성해보세요");
    navi("project");
  };

  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label htmlFor="">이메일</label>
          <TextInput
            type="email"
            id="email"
            value={email}
            onChange={setEmail}
            label="이름"
            placeholder="박보검"
          />
        </div>
        <div>
          <label htmlFor="">이름</label>

          <option value="">직종선택</option>
          <select name="" id=""></select>
        </div>
        <div>
          <label htmlFor="jobDesc">jobDesc</label>
          <input
            type="text"
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value as AUTH.UserJob)}
          />
        </div>
        <div>
          <label htmlFor="">비밀번호</label>
          <input
            type="jobDesc"
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button>{isNew ? "회원가입" : "로그인"}</button>
      </form>
    </div>
  );
};

export default AuthPage;
