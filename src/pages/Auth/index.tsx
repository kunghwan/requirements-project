import { useRef, useState } from "react";
import { emailValidator } from "../../utils";
import { AUTH } from "../../context/hooks";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../../components/ui/TextInput";

const AuthPage = () => {
  const isNew = useSearchParams()[0].get("content");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [jobDesc, setJobDesc] = useState<AUTH.UserJob | "">("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef<HTMLSelectElement>(null);

  const { signin, signup } = AUTH.use();

  const navi = useNavigate();

  const onSubmit = async () => {
    if (isNew) {
      if (name.length === 0) {
        alert("이름을 입력해주세요.");
        return nameRef.current?.focus();
      }
      if (jobDesc.length === 0) {
        alert("종사직종을 선택해주세요.");
        return jobRef.current?.showPicker();
      }
    }
    const isEmail = emailValidator(email);
    if (!isEmail) {
      alert("이메일을 확인해주세요.");
      return emailRef.current?.focus();
    }
    if (password.length < 6 || password.length > 18) {
      alert("비밀번호를 확인해주세요. 6-18자 사이 입니다.");
      return passwordRef.current?.focus();
    }

    if (!isNew) {
      const { success, message } = await signin(email, password);
      if (!success) {
        if (message === "존재하지 않는 유저입니다.") {
          // 회원가입 하도록 변경
          // 페이지 이동
          if (confirm(message + " " + "회원가입 하시겠습니까?")) {
            navi("/signin?content=new");
            return setTimeout(() => {
              nameRef.current?.focus();
            }, 300);
          }
          return;
        }
        return alert(message);
      }
      alert("환영합니다.");
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
    alert("회원가입을 진심으로 축하드립니다. 프로젝트를 생성해보세요!");
    navi("/project");
  };
  return (
    <div>
      <form
        className="col gap-y-2.5 max-w-100 mx-auto p-5"
        onSubmit={(e) => {
          e.preventDefault();
          //! 새로고침 방지

          onSubmit();
        }}
      >
        {isNew && (
          <>
            <TextInput
              ref={nameRef}
              type="text"
              id="name"
              value={name}
              onChange={setName}
              placeholder="박보검"
              label="이름"
            />

            <TextInput
              ref={jobRef}
              id="jobDesc"
              value={jobDesc}
              onChange={(value) => setJobDesc(value as AUTH.UserJob)}
              label="직종"
              data={AUTH.userJobs}
              placeholder="직종 선택"
              isSelectTag
            />
          </>
        )}

        <TextInput
          ref={emailRef}
          type="email"
          id="email"
          value={email}
          onChange={setEmail}
          placeholder="email@email.com"
          label="이메일"
        />

        <TextInput
          label="비밀번호"
          type="password"
          id="password"
          value={password}
          onChange={setPassword}
          placeholder="* * * * * * * *"
          ref={passwordRef}
        />
        <button className="button mt-2.5">
          {isNew ? "회원가입" : "로그인"}
        </button>
        <Link
          to={isNew ? "/signin" : "/signin?content=new"}
          className="button cancel"
        >
          {isNew ? "돌아가기" : "회원가입"}
        </Link>
      </form>
    </div>
  );
};

export default AuthPage;
