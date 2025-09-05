import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Task } from './App'

const DATA: Task[] = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

const rootElement = document.getElementById('root'); 

if (rootElement) {
createRoot(rootElement).render(
  <StrictMode>
    <App tasks={DATA} />
  </StrictMode>,
)
}