import { useEffect, useState } from "react";
import { AUTH } from "../../context/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, FBCollection } from "../../lib/firebase";
import NotFound from "../../components/ui/NotFound";
import RequirementItem from "../Requirement/RequirementItem";
import RequirementForm from "../Requirement/RequirementForm";

const RDetailPage = () => {
  const [project, setProject] = useState<ProjectProps | null>(null); // Corrected line: useState hook with type annotation
  const [r, setR] = useState<RProps | null>(null); // Corrected line: useState hook with type annotation
  const { user } = AUTH.use();
  const { rid, projectId } = useParams<{ rid: string; projectId: string }>();

  useEffect(() => {
    const subR = db
      .collection(FBCollection.REQUIREMENTS)
      .doc(rid)
      .onSnapshot((doc) => {
        const data = { ...(doc.data() as RProps), id: doc.id };
        if (!data.function) {
          setR(null);
        } else {
          setR(data);
        }
      });

    return () => subR(); // Cleanup the subscription
  }, [rid]);

  useEffect(() => {
    const subProject = db
      .collection(FBCollection.PROJECTS)
      .doc(projectId)
      .onSnapshot((doc) => {
        const data = doc.data() as ProjectProps;
        if (!data) {
          setProject(null);
        } else {
          setProject(data);
        }
      });

    return () => subProject(); // Cleanup the subscription
  }, [projectId]);

  const navi = useNavigate();

  const back = () => {
    navi(`/project/${projectId}`);
  };

  if (!r) {
    return <NotFound message="존재하지 않는 페이지 입니다." />;
  }

  if (r.isSharable && (!user || user.uid !== r.uid)) {
    return (
      <div className="p-5">
        <h1 className="mb-2.5">프로젝트 이름</h1>
        <RequirementItem {...r} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <div className="flex gap-x-1 items-center text-gray-500">
          <Link to={"/project"} className="p-2.5 hover:text-theme">
            프로젝트
          </Link>
          <p>{">"}</p>
          <Link to={`/project/${projectId}`} className="p-2.5 hover:text-theme">
            요구사항
          </Link>
        </div>
      </div>
      <h1>{project?.name || "프로젝트 제목"}</h1>{" "}
      {/* Display project name if available */}
      <RequirementForm
        payload={r}
        onCancel={back}
        projectId={r.projectId}
        uid={user?.uid as string}
        onSubmitEditing={back}
      />
    </div>
  );
};

export default RDetailPage;
