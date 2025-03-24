import React, { useEffect, useState } from "react";
import { AUTH } from "../../context/hooks";
import { db, FBCollection } from "../../lib/firebase";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";
const Project = () => {
  const { user } = AUTH.use();

  const [projects, setProjects] = useState<ProjectProps[]>([]);

  useEffect(() => {
    if (user) {
      const subProjects = db
        .collection(FBCollection.PROJECTS)
        .where("uid", "==", user?.uid)
        .onSnapshot((snap) => {
          const data = snap.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as ProjectProps)
          );

          setProjects(data as ProjectProps[]);
        });

      subProjects;
      return subProjects;
    }
  }, [user]);

  const [isAdding, setIsAdding] = useState(false);
  const addHandler = () => setIsAdding((prev) => !prev);

  return user ? (
    <div className="pt-25 px-5">
      <div className="flex max-w-300 items-center p-5 fixed top-[61px] left-[50%] w-full bg-white justify-between border-b border-border -translate-x-[50%]">
        <h1 className="font-black text-xl">{user.name}의 프로젝트들</h1>
        <button onClick={addHandler} className="button">
          추가
        </button>
        {isAdding && (
          <ProjectForm onCancel={addHandler} onSubmitEditing={() => {}} />
        )}
      </div>
      <div className="max-w-300 mx-auto">
        <p>{projects.length}개의 프로젝트가 있습니다.</p>

        <ul className="col gap-y-2.5">
          {projects.map((project, index) => (
            <li key={project?.id}>
              <ProjectItem {...project} index={index + 1} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <h1>No user</h1>
  );
};

export default Project;
