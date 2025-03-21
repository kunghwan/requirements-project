import { FormEvent, useEffect, useRef, useState } from "react";
import TextInput from "../../components/ui/TextInput";
import { db, FBCollection } from "../../lib/firebase";
import { AUTH } from "../../context/hooks";

interface Props {
  payload?: ProjectProps;

  onCancel: () => void;

  onSubmitEditing?: () => void;
}

const ProjectForm = ({ onCancel, onSubmitEditing, payload }: Props) => {
  const [name, setName] = useState(payload?.name ?? "");
  const nameRef = useRef<HTMLInputElement>(null);

  const { user } = AUTH.use();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    if (name.length === 0) {
      alert("프로젝트 이름을 입력해주세요.");
      return nameRef.current?.focus();
    }

    const ref = db.collection(FBCollection.PROJECTS);

    if (payload) {
      if (payload.name === name) {
        alert("변경사항이 없습니다.");
        return;
      }

      try {
        await ref.doc(payload?.id).update({ name });
        alert("수정되었습니다.");
        onCancel();
        if (onSubmitEditing) {
          onSubmitEditing();
        }
      } catch (error: any) {
        alert(error.message);
      }

      return;
    }

    try {
      const newProejct: ProjectProps = {
        name,
        uid: user.uid,
      };
      await ref.add(newProejct);
      alert("추가되었습니다.");
      onCancel();
      if (onSubmitEditing) {
        onSubmitEditing();
      }
    } catch (error: any) {
      return alert(error.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="border rounded bg-white p-5 shadow-md border-border"
      >
        <TextInput
          id="name"
          label="프로젝트 이름"
          onChange={setName}
          ref={nameRef}
          value={name}
          placeholder="멋진 프로젝트 이름"
        />
        <div className="flex gap-x-2.5 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1/2 button cancel"
          >
            취소
          </button>
          <button className="w-full button">{payload ? "수정" : "추가"}</button>
        </div>
      </form>
      <button
        onClick={onCancel}
        className="absolute w-full h-full bg-lightgray/50 -z-10"
      />
    </div>
  );
};

export default ProjectForm;
