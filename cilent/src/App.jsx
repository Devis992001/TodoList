import { useEffect, useState } from "react";
import styles from "./styles.css";
import Todo from "./Todo";
export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();

        // Log the data to check its format
        console.log("Fetched data:", data);

        // Check if the data is an array and set the todos
        if (Array.isArray(data)) {
          setTodos(data);
        } else if (data.todos && Array.isArray(data.todos)) {
          // Handle case where data is an object with a todos array
          setTodos(data.todos);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    getTodos();
  }, []);
  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();
      setContent("");
      setTodos([...todos, newTodo]);
    }
  };
  return (
    <main className="container">
      <h1 className="title">Todo List</h1>

      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo...."
          className="form_input"
          required
        />
        <button className="btn btn-danger" type="submit">
          Create Todo
        </button>
      </form>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="todos">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Todo key={todo._id} todo={todo} setTodos={setTodos} />
            ))
          ) : (
            <p className="text-secondary">No todos available.</p>
          )}
        </div>
      )}
    </main>
  );
}
