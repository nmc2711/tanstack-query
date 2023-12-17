import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const fetchToDos = async ({ pageParam = 1 }) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}&_limit=10`
  );

  console.log(response.data);
  return response.data;
};

function App() {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchToDos,
    getNextPageParam: (lastPage, allPages) => {
      // 여기서 다음 페이지 번호를 결정합니다.
      // 예를 들어, 총 페이지 수가 알려져 있다면 그에 따라 조정할 수 있습니다.
      const nextPage = allPages.length + 1;
      return nextPage <= 5 ? nextPage : undefined; // 최대 5 페이지까지만 불러오도록 설정
    },
    initialData: {
      pages: [
        [
          { userId: 9998, id: 9998, title: "황상한 봇", completed: false },
          { userId: 9999, id: 9999, title: "황상한 봇2", completed: false },
        ],
      ],
      pageParams: [1],
    },
  });

  return (
    <main>
      <header>
        <h3>할 일 목록</h3>
      </header>
      <section>
        {isFetchingNextPage && <p>로딩중...</p>}
        {isError && <article>에러메시지: {error.message}</article>}
        <ul>
          {data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </React.Fragment>
          ))}
        </ul>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? "로딩 중..." : "더 보기"}
        </button>
      </section>
    </main>
  );
}

export default App;
