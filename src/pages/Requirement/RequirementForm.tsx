import { FormEvent, useEffect, useRef, useState } from "react";
import TextInput from "../../components/ui/TextInput";
import { db, FBCollection } from "../../lib/firebase";
import { progresses } from "../../lib/dummy";
interface RProps {
  page: string;
  function: string;
  desc: string[]; // Array of descriptions
  managers: string[]; // Array of manager names
  createdAt: number; // Timestamp
  projectId: string;
  progress: string; // Could be a string representing the progress
  uid: string;
  isSharable?: boolean; // Optional field for sharing status
  id?: string; // Optional field for the document ID (for update operations)
}

interface Props {
  payload?: RProps;
  onCancel: () => void;
  uid: string;
  projectId: string;
  onSubmitEditing?: () => void;
}

const initialState: RProps = {
  page: "",
  function: "",
  desc: [],
  managers: [],
  createdAt: new Date().getTime(),
  projectId: "",
  progress: "",
  uid: "",
};

const RequirementForm = ({
  onCancel,
  payload,
  projectId,
  uid,
  onSubmitEditing,
}: Props) => {
  const [r, setR] = useState<RProps>(payload ?? initialState);
  const [desc, setDesc] = useState("");
  const [manager, setManager] = useState("");

  const pRef = useRef<HTMLInputElement>(null);
  const fRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const proRef = useRef<HTMLSelectElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  const [isWritingDesc, setIsWritingDesc] = useState(false);
  const [isWritingManager, setIsWritingManager] = useState(false);

  const onChangeR = (target: keyof RProps, value: any) =>
    setR((prev) => ({ ...prev, [target]: value }));

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputType: "desc" | "manager"
  ) => {
    const { key, nativeEvent } = e;

    if (key === "Tab" || key === "Enter") {
      if (!nativeEvent.isComposing) {
        e.preventDefault(); // Prevent default behavior of tab/enter key
        if (inputType === "desc") {
          if (desc.length === 0) {
            alert("상세 내용을 입력해주세요.");
            dRef.current?.focus();
            return;
          }
          if (r.desc.includes(desc)) {
            alert("중복된 상세 내용입니다.");
            dRef.current?.focus();
            return;
          }
          onChangeR("desc", [desc, ...r.desc]);
          setDesc(""); // Clear desc input after adding
        } else if (inputType === "manager") {
          if (manager.length === 0) {
            alert("담당자 이름을 입력해주세요.");
            mRef.current?.focus();
            return;
          }
          if (r.managers.includes(manager)) {
            alert("중복된 담당자입니다.");
            mRef.current?.focus();
            return;
          }
          onChangeR("managers", [manager, ...r.managers]);
          setManager(""); // Clear manager input after adding
        }
      }
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isWritingDesc || isWritingManager) {
      return;
    }

    if (r.progress.length === 0) {
      alert("진행상태를 선택해주세요.");
      return proRef.current?.showPicker();
    }
    if (r.page.length === 0) {
      alert("기능 적용할 페이지를 입력해주세요.");
      return pRef.current?.focus();
    }
    if (r.function.length === 0) {
      alert("기능 이름을 입력해주세요.");
      return fRef.current?.focus();
    }
    if (r.desc.length === 0) {
      alert("최소 1개의 상세 내용을 입력해주세요.");
      return dRef.current?.focus();
    }
    if (r.managers.length === 0) {
      alert("최소 1명의 담당자를 입력해주세요.");
      return mRef.current?.focus();
    }

    const ref = db.collection(FBCollection.REQUIREMENTS);

    if (!payload) {
      const newR: RProps = {
        ...r,
        uid,
        projectId,
      };
      try {
        await ref.add(newR);
        alert("추가되었습니다.");
        onCancel();
        setR(initialState);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      const isSame = JSON.stringify(payload) === JSON.stringify(r);
      if (isSame) {
        alert("변경사항이 없습니다.");
        return;
      }

      try {
        await ref
          .doc(payload.id)
          .update({ ...r, isSharable: sRef.current?.checked });
        alert("수정되었습니다.");
        onCancel();
        if (onSubmitEditing) onSubmitEditing();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => proRef.current?.showPicker(), 300);
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="col gap-y-2.5 my-2.5 max-w-100 mx-auto"
    >
      <div className="flex gap-x-2.5">
        <TextInput
          isSelectTag
          id="progress"
          label="진행상태"
          onChange={(progress) => {
            onChangeR("progress", progress);
            if (progress.length > 0) {
              pRef.current?.focus();
            }
          }}
          ref={proRef}
          value={r.progress}
          placeholder="진행 상태 선택"
          data={progresses}
        />
        <div className="flex-1">
          <TextInput
            id="page"
            label="기능 적용 페이지"
            onChange={(p) => onChangeR("page", p)}
            ref={pRef}
            value={r.page}
            placeholder="예) Home"
          />
        </div>
      </div>
      <TextInput
        id="function"
        label="요구사항 기능 이름"
        onChange={(f) => onChangeR("function", f)}
        ref={fRef}
        value={r.function}
        placeholder="요구사항 기능 예) 이미지 슬라이드"
      />
      <div className="ti-div">
        <label htmlFor="desc" className="ti-label">
          요구사항 상세 내용
        </label>
        <input
          id="desc"
          type="text"
          className="ti-input px-1.5"
          placeholder="요구사항 상세 내용 작성 예) 홈페이지에서 향기가 나게 해주세요."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          ref={dRef}
          onFocus={() => setIsWritingDesc(true)}
          onBlur={() => setIsWritingDesc(false)}
          onKeyDown={(e) => handleKeyDown(e, "desc")}
        />
        {r.desc.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-1.5">
            {r.desc.map((item) => (
              <li
                key={item}
                className="flex cursor-pointer"
                onClick={() =>
                  setR((prev) => ({
                    ...prev,
                    desc: prev.desc.filter((desc) => desc !== item),
                  }))
                }
              >
                <p className="px-1 bg-lightgray rounded ti-label">{item} X</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ti-div">
        <label htmlFor="manager" className="ti-label">
          담당자
        </label>
        <input
          id="manager"
          type="text"
          className="ti-input px-1.5"
          placeholder="담당자 이름을 입력해주세요."
          value={manager}
          onChange={(e) => setManager(e.target.value)}
          ref={mRef}
          onFocus={() => setIsWritingManager(true)}
          onBlur={() => setIsWritingManager(false)}
          onKeyDown={(e) => handleKeyDown(e, "manager")}
        />
        {r.managers.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-1.5">
            {r.managers.map((item) => (
              <li
                key={item}
                className="flex cursor-pointer"
                onClick={() =>
                  setR((prev) => ({
                    ...prev,
                    managers: prev.managers.filter(
                      (manager) => manager !== item
                    ),
                  }))
                }
              >
                <p className="px-1 bg-lightgray rounded ti-label">{item} X</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-center">
        <label htmlFor="share" className="text-sm text-gray-500">
          누구나 볼 수 있도록 공유하시겠습니까?
        </label>
        <input
          type="checkbox"
          id="share"
          ref={sRef}
          className="w-5 h-5"
          checked={r.isSharable}
          onChange={(e) => onChangeR("isSharable", e.target.checked)}
        />
      </div>

      <div className="flex gap-x-2.5 mt-2.5">
        <button
          type="button"
          className="button cancel flex-1"
          onClick={onCancel}
        >
          취소
        </button>
        <button className="button flex-2">{payload ? "수정" : "추가"}</button>
      </div>
    </form>
  );
};

export default RequirementForm;
