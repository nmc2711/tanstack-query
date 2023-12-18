import React from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const fetchToDos = async ({ pageParam = 1 }) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}&_limit=10`
  );

  console.log(response.data);
  return response.data;
};

const createTodo = async (newTodo) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/todos",
    newTodo
  );
  return response.data;
};

function App() {
  const queryClient = useQueryClient();

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
      const nextPage = allPages.length + 1;
      return nextPage <= 5 ? nextPage : undefined;
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
  const addNewTodo = () => {
    const newTodo = {
      userId: 1,
      id: Date.now(),
      title: "새로운 할 일",
      completed: false,
    };
    addTodoMutation.mutate(newTodo);
  };

  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess(data) {
      const currentData = queryClient.getQueryData(["add"]);
      const updatedData = currentData ? [...currentData, data] : [data];

      queryClient.setQueryData(["add"], updatedData);
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
        <button onClick={addNewTodo} disabled={addTodoMutation.isLoading}>
          {addTodoMutation.isPending ? "추가 중..." : "할 일 추가"}
        </button>
      </section>
    </main>
  );
}

export default App;
