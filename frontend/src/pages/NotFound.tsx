import { Link } from "react-router";

export default function NotFound() {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-8 text-xl">페이지를 찾을 수 없습니다</p>
      <Link to="/" className="text-blue-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
