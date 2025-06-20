import React, { useState } from "react";

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, done: false }]);
      setInput("");
    }
  };

  const toggleDone = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          placeholder="Nouvelle tâche"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
          ➕
        </button>
      </div>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} className="flex items-center justify-between mb-2">
            <span
              onClick={() => toggleDone(i)}
              className={`flex-grow cursor-pointer ${task.done ? "line-through text-gray-500" : ""}`}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(i)} className="text-red-500 hover:text-red-700">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
