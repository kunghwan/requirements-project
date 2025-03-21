import React, { useEffect, useState } from "react";
import { AUTH } from "../../context/hooks";
import { useParams } from "react-router-dom";
import { db, FBCollection } from "../../lib/firebase";
import NotFound from "../../components/ui/NotFound";
import RequirementItem from "../Requirement/RequirementItem";

const RDetailPage = () => {
  const [r, setR] = useState<RProps | null>(null);
  const { user, signout } = AUTH.use();
  const { rid, projectId } = useParams<{ rid: string; projectId: string }>();

  useEffect(() => {
    const subR = db
      .collection(FBCollection.REQUIREMENTS)
      .doc(rid)
      .onSnapshot((doc) => {
        const data = { ...(doc.data() as RProps) };
        if (!data.function) {
          setR(null);
        } else {
          setR(data);
        }
      });

    subR;
    return subR;
  }, [rid]);

  if (!r) {
    return <NotFound message="존재하지 않는 페이지 입니다." />;
  }

  if (r.isSharable && (!user || user.uid !== r.uid)) {
    return (
      <div className="p-5">
        <RequirementItem {...r} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={async () => {
          await signout();
        }}
      >
        logout
      </button>
    </div>
  );
};

export default RDetailPage;
