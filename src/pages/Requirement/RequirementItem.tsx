import { useState } from "react";
import { progresses } from "../../lib/dummy";
import { db, FBCollection } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { AUTH } from "../../context/hooks";

const RequirementItem = (r: RProps) => {
  const { user } = AUTH.use();
  const { page, desc, function: f, managers, progress } = r;

  const [isHovering, setIsHovering] = useState(false);

  const ref = db.collection(FBCollection.REQUIREMENTS).doc(r.id);

  const navi = useNavigate();

  return (
    <div
      className="border rounded p-2.5 border-border col relative"
      onMouseEnter={() => {
        if (!user || user.uid === r.id) {
          return;
        }
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      {isHovering && (
        <div className="flex gap-x-2.5 absolute bottom-2.5 right-2.5">
          <button className="button cancel" onClick={() => navi(r.id!)}>
            수정
          </button>
          <button
            className="hover:text-red-500 button cancel"
            onClick={async () => {
              if (confirm("해당 요구사항을 삭제하시겠습니까?")) {
                try {
                  await ref.delete();
                  alert("삭제되었습니다.");
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
      <div className="flex justify-between border-b border-border pb-2.5">
        <p className="font-bold">
          {page}/{f}
        </p>
        {user && user.uid === r.uid ? (
          <select
            value={progress}
            onChange={async (e) => {
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
        ) : (
          <p>{progress}</p>
        )}
      </div>
      <ul className="col p-2.5 gap-y-1">
        {desc.map((item, index) => (
          <li key={item} className="font-light">
            {index + 1}. {item}
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-1">
        {managers.map((item) => (
          <li
            key={item}
            className="p-2 rounded bg-lightgray text-sm hover:bg-gray-100 py-1"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementItem;
