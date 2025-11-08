import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import RepositorySearchBar from "@/features/search/components/SearchBar";

export default function SearchPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">새 글 작성</h1>
        <Button text="직접 작성하기" />
      </div>
      <div className="space-y-8 rounded-md border border-gray-300 p-10">
        <RepositorySearchBar />
        <Divider />
      </div>
    </div>
  );
}
