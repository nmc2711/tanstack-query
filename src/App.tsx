import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const fetchToDos = async (page) => {
  return await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`
  );
};

function App() {
  const [page, setPage] = useState(1);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => fetchToDos(page),
    placeholderData: keepPreviousData,
  });

  return (
    <main>
      <header>
        <h3>현재 페이지: {page}</h3>
      </header>
      <nav>
        <button onClick={() => setPage(page - 1)}>이전</button>{" "}
        <button onClick={() => setPage(page + 1)}>다음</button>
      </nav>
      <section>
        {isFetching && <p> 로딩중...</p>}
        {isError && <article>에러메시지: {error.message}</article>}
        <ul>
          {data?.data.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
