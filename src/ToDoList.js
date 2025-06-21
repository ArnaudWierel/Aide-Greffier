import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

// Texte de base
const initialTexts = [
  "Demander l’identité de la personne voulant se faire juger",
  "Chercher son nom et prénom sur le MDT, si il n’est pas sur le mdt (car les faits remontent d’il y a trop longtemps), chercher son nom sur la radio-d de la LSPD (pour les jugements VP/VW)",
  "Appeler les postes de polices pour assurer le jugement (si vous avez des numéros d’agents, appelez-les sinon envoyez un message dans l’application services)",
  "Demander les papiers complémentaires (PPA et permis de conduire) afin de les mettre dans l’outil de justice",
  "Remplir l’outil de justice entièrement",
  "Ne pas oublier le rajout des frais de justice",
  "Demande de fouille par les agents, demande des matricules des agents afin de les mettre dans l’outil, demandez au agent de vérifier les amendes impayés de l’individu",
  "Remplissage et ajout des documents sur les différentes radio-d",
];

// On crée un tableau d’objets dotés d’un id unique
const defaultSteps = initialTexts.map(text => ({
  id: uuidv4(),
  text,
  done: false,
}));

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // 1) Chargement initial : si localStorage est vide ou invalide, on charge defaultSteps
  useEffect(() => {
    const stored = localStorage.getItem("greffier-tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // On n'accepte parsed que s'il s'agit d'un tableau non vide et avec de bons objets
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every(t => t.id && typeof t.text === "string")
        ) {
          setTasks(parsed);
          return;
        }
      } catch {
        // passe
      }
    }
    // Sinon, on réinitialise
    setTasks(defaultSteps);
  }, []);

  // 2) Sauvegarde automatique à chaque changement
  useEffect(() => {
    localStorage.setItem("greffier-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const txt = input.trim();
    if (!txt) return;
    setTasks([
      ...tasks,
      { id: uuidv4(), text: txt, done: false },
    ]);
    setInput("");
  };

  const toggleDone = id =>
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = id =>
    setTasks(tasks.filter(t => t.id !== id));

  const resetToDefault = () => setTasks(defaultSteps);

  const handleDragEnd = result => {
    if (!result.destination) return;
    const copy = Array.from(tasks);
    const [moved] = copy.splice(result.source.index, 1);
    copy.splice(result.destination.index, 0, moved);
    setTasks(copy);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">✅ To-Do Greffier</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          placeholder="Nouvelle étape"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          ➕
        </button>
        <button
          onClick={resetToDefault}
          className="bg-red-600 text-white px-4 rounded hover:bg-red-700"
        >
          ♻️ Reset
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="task-list">
    {(provided) => (
      <ul
        className="space-y-2"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(prov) => (
              <li
                ref={prov.innerRef}
                {...prov.draggableProps}
                {...prov.dragHandleProps}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded hover:bg-gray-100"
              >
                <div className="flex items-center flex-grow cursor-pointer">
                  <span className="w-6 text-right mr-2 font-mono">
                    {index + 1}.
                  </span>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={task.done}
                    onChange={() => toggleDone(task.id)}
                  />
                  <span className={task.done ? "line-through text-gray-500" : ""}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  🗑️
                </button>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

    </div>
  );
}
