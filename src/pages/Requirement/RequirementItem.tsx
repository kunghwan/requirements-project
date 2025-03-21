import { useState } from "react";
import { progresses } from "../../lib/dummy";
import { db, FBCollection } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

const RequirementItem = (r: RProps) => {
  const { page, desc, function: f, managers, progress } = r;

  const [isHovering, setIsHovering] = useState(false);

  const ref = db.collection(FBCollection.REQUIREMENTS).doc(r.id);

  const navi = useNavigate();

  const move = () => {
    navi(r.id!);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      className="border rounded p-2.5 border-border hover:bg-lightgray bg-red-300"
      onMouseEnter={() => {
        if (!user || user.uid === r.id) setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      {isHovering && (
        <div className="flex gap-x-2.5 absolute bottom-2.5 right-2.5">
          <button className="button cancel" onClick={move}>
            수정
          </button>
          <button
            className="hover:text-red-500 button cancel"
            onClick={async () => {
              if (confirm("해당 요구사항 삭제")) {
                try {
                  await ref.delete();
                  alert("삭제");
                } catch (error: any) {
                  return alert(error.message);
                }
              }
            }}
          >
            삭제
          </button>
        </div>
      )}
      <div className="flex justify-between border-b border-border pb-2">
        <button
          className="font-bold  flex-1 items-start text-left cursor-pointer"
          onClick={() => navi(r.id!)}
        >
          {page}/{f}
        </button>
        <select
          value={progress}
          onChange={async (e) => {
            const ref = db.collection(FBCollection.REQUIREMENTS).doc(r.id);
            try {
              await ref.update({ progress: e.target.value });
            } catch (error: any) {
              return alert(error.message);
            }
          }}
        >
          {progresses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <ul className="col p-2.5 gap-y-1">
        {desc.map((item, index) => (
          <li key={item} className="font-light">
            {index + 1}.{item}
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-1">
        {managers.map((item) => (
          <li
            key={item}
            className="px-1 rounded bg-lightgray text-sm p-2 hover:bg-gray-400 py-1"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementItem;
