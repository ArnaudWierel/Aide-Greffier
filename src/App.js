import React, { useState } from "react";
import AudienceGenerator from "./AudienceGenerator";
import ToDoList from "./ToDoList";

export default function App() {
  const [activeTab, setActiveTab] = useState("audience");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center p-4 space-x-4 bg-white shadow-md">
        <button
          onClick={() => setActiveTab("audience")}
          className={`py-2 px-4 font-semibold rounded ${
            activeTab === "audience" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
        >
          🎙️ Audience
        </button>
        <button
          onClick={() => setActiveTab("todo")}
          className={`py-2 px-4 font-semibold rounded ${
            activeTab === "todo" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
        >
          ✅ To-Do
        </button>
      </div>

      <div className="p-4">
        {activeTab === "audience" ? <AudienceGenerator /> : <ToDoList />}
      </div>
    </div>
  );
}
