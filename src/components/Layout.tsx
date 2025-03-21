import { KeyboardEvent, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { menus } from "../lib/dummy";
import { AUTH } from "../context/hooks";

const Layout = () => {
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const menuHandler = () => setIsMenuShowing((prev) => !prev);

  const navi = useNavigate();
  const { user } = AUTH.use();

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
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b border-border z-10">
        <div className="flex justify-between max-w-300 mx-auto items-center">
          <h1 className="font-black">요구사항 앱</h1>
          <button onClick={menuHandler} className="button cancel">
            메뉴보기
          </button>
        </div>
      </header>

      {isMenuShowing && (
        <nav>
          <ul className="fixed top-0 left-0 w-full h-screen z-10 col justify-center items-center bg-black/10 rounded shadow-md">
            {menus.map((menu) => {
              // Skip rendering '로그인' if the user is logged in
              if (user && menu.name === "로그인") {
                return null;
              }
              return (
                <li key={menu.name}>
                  <button
                    className="button cancel w-full"
                    onClick={() => {
                      if (!menu.path) return;
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
          <span className="absolute -z-0 w-full h-full" onClick={menuHandler} />
        </nav>
      )}

      <main className="pt-15">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
