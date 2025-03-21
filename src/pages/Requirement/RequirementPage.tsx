import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, FBCollection } from "../../lib/firebase";
import { AUTH } from "../../context/hooks";
import ProjectItem from "../Project/ProjectItem";
import NotFound from "../../components/ui/NotFound";
import RequirementForm from "./RequirementForm";
import RequirementItem from "./RequirementItem";

const RequirementPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [requirements, setRequirements] = useState<RProps[]>([]);

  const [project, setProject] = useState<ProjectProps | null>(null);

  const { user } = AUTH.use();
  useEffect(() => {
    if (user && projectId) {
      const subR = db
        .collection(FBCollection.REQUIREMENTS)
        .where("uid", "==", user?.uid)
        .where("projectId", "==", projectId)
        .onSnapshot((snap) => {
          const data = snap.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as RProps)
          );

          // const sort = () => {
          //   return data.sort((a, b) => {
          //     if (a.createdAt === b.createdAt) {
          //       return 0;
          //     } else if (a.createdAt > b.createdAt) {
          //       return -1;
          //     } else {
          //       return 1;
          //     }
          //   });
          // };

          // console.log("sorted array", sort());

          setRequirements(data);
        });

      subR;
      return subR;
    }
  }, [user, projectId]);

  useEffect(() => {
    if (user && projectId) {
      const subProject = db
        .collection(FBCollection.PROJECTS)
        .doc(projectId)
        .onSnapshot((doc) => {
          const data = { ...doc.data(), id: doc.id } as ProjectProps;
          if (!data.name || !data.uid) {
            setProject(null);
          } else {
            setProject(data);
          }
        });

      subProject;
      return subProject;
    }
  }, [user, projectId]);

  const [isAdding, setIsAdding] = useState(false);
  const addHandler = () => setIsAdding((prev) => !prev);

  return !project ? (
    <NotFound
      message="해당 프로젝트는 삭제되었거나 존재하지 않습니다."
      to="/project"
    />
  ) : (
    <div className="p-5">
      <ProjectItem {...project} />
      {isAdding ? (
        <RequirementForm
          uid={user?.uid as string}
          projectId={project.id!}
          onCancel={addHandler}
        />
      ) : (
        <button className="button mt-5" onClick={addHandler}>
          요구사항 추가
        </button>
      )}
      <ul className="col gap-y-2.5 mt-5">
        {requirements.map((r) => (
          <li key={r?.id}>
            <RequirementItem {...r} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementPage;
