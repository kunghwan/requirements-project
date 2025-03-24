import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full h-screen col justify-center items-center gap-y-5">
      <div className="col gap-y-2.5 max-w-100">
        <h1 className="text-4xl font-black">아직도 엑셀로 요구사항을??</h1>
        <h2 className="font-light text-lg">
          파이어베이스로 연동해둔 데이터베이스로 지하철, 버스, 택시 등 이동
          시간에 짬 내서 빨리빨리 추가하시고 수정하시고 삭제하세요!
        </h2>
      </div>
      <Link to="signin" className="button">
        지금 시작하세요
      </Link>
    </div>
  );
};

export default Home;
