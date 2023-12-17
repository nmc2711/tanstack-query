import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const getToDo = async () => {
  return await axios.get("https://jsonplaceholder.typicode.com/todos");
};

function App() {
  const { data, isSuccess } = useQuery({
    queryKey: ["todos"],
    queryFn: getToDo,
  });

  if (isSuccess) console.log(data);

  return <p>안녕하세요. 상한입니다. 리액트쿼리 테스트 입니다.</p>;
}

export default App;
