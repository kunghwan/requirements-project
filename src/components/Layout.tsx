import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { menus } from "../lib/dummy";
import { AUTH } from "../context/hooks";

const Layout = () => {
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const menuHandler = () => setIsMenuShowing((prev) => !prev);

  const navi = useNavigate();
  const { user, signout } = AUTH.use();

  useEffect(() => {
    const detect = (e: KeyboardEvent) => {
      if (isMenuShowing) {
        const { key } = e;
        if (key === "Escape") {
          setIsMenuShowing(false);
        }
      }
    };
    window.addEventListener("keydown", detect);

    return () => {
      window.removeEventListener("keydown", detect);
    };
  }, [isMenuShowing]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b border-border z-10">
        <div className="flex justify-between max-w-300 mx-auto items-center p-2.5">
          <h1 className="font-black text-2xl">요구사항 앱</h1>
          <button onClick={menuHandler} className="button cancel">
            메뉴보기
          </button>
        </div>
      </header>
      {isMenuShowing && (
        <nav className="fixed top-0 left-0 w-full h-screen z-10 bg-black/10 col justify-center items-center">
          <ul className="bg-white border border-border col gap-y-2.5 p-2.5 rounded shadow-md">
            {menus.map((menu) => {
              if (user) {
                if (menu.name === "로그인") {
                  return (
                    <li key={menu.name}>
                      <button
                        className="button cancel w-full"
                        onClick={async () => {
                          //로그아웃
                          await signout();
                          menuHandler();
                          alert("로그아웃되었습니다.");
                          navi("/");
                        }}
                      >
                        로그아웃
                      </button>
                    </li>
                  );
                }
              }

              return (
                <li key={menu.name}>
                  <button
                    className="button cancel w-full"
                    onClick={() => {
                      if (!menu.path) {
                        return;
                      }
                      navi(menu.path);
                      menuHandler();
                    }}
                  >
                    {menu.name}
                  </button>
                </li>
              );
            })}
          </ul>
          <span
            className="absolute -z-10 w-full h-full"
            onClick={menuHandler}
          />
        </nav>
      )}

      <main className="pt-15">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
