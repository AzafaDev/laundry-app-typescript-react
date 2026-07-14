import { useSearchParams } from "react-router-dom";

const DEFAULT_LIMIT = 50;

export function usePaginationParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT);
  const offset = (page - 1) * limit;

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
  };

  return { page, limit, offset, setPage };
}
