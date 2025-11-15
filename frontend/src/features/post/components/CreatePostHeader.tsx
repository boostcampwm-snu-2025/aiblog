import Button from "@/components/ui/Button";

export default function CreatePostHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <Button>직접 작성하기</Button>
    </div>
  );
}
