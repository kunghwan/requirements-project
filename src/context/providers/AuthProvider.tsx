import { useState, useEffect, PropsWithChildren } from "react";
import { AUTH } from "../hooks";
import { authService, db } from "../../lib/firebase";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AUTH.User | null>(AUTH.initialState.user);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = async (uid: string) => {
    try {
      const snap = await db.collection("users").doc(uid).get();
      const data = snap.data() as AUTH.User | undefined;

      if (data) {
        setUser(data); // 사용자를 상태로 설정
        console.log(data, "fetched");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((fbUser) => {
      if (!fbUser) {
        console.log("no user logged in");
        setUser(null);
      } else {
        console.log(fbUser.uid, "fetch data from db");
        fetchUser(fbUser.uid);
      }

      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  const signout = async (): PromiseResult => {
    try {
      await authService.signOut();
      setUser(null);
      return { success: true };
    } catch (error: any) {
      return { message: error.message };
    }
  };

  const signin = async (email: string, password: string): PromiseResult => {
    try {
      await authService.signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error: any) {
      if (
        error.message ===
        "Firebase: The supplied auth credential is incorrect, malformed or has expired. (auth/invalid-credential)."
      ) {
        const snap = db.collection("users").where("email", "==", email).get();
        const data = snap.docs.map((doc) => ({ ...doc.data() }));
        if (!data || data.length === 0) {
          return { message: "ㄴㅇㄹㄴㅇ" };
        }
        return { message: "존재하지 않는 회원 회원가입하시겠습니까?" };
      }
      return { message: error.message };
    }
  };

  const signup = async ({
    email,
    name,
    jobDesc,
    password,
  }: {
    email: string;
    password: string;
    name: string;
    jobDesc: AUTH.UserJob;
  }): PromiseResult => {
    try {
      const { user } = await authService.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!user) {
        return { message: "존재하지 않은 유저" };
      }

      const newUser: AUTH.User = { email, name, jobDesc, uid: user.uid };

      await db.collection("users").doc(user.uid).set(newUser);

      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      return { message: error.message };
    }
  };

  return (
    <AUTH.Context.Provider
      value={{ initialized, signin, signout, signup, user }}
    >
      {children}
    </AUTH.Context.Provider>
  );
}
