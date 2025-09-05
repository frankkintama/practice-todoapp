import { useState, useRef, useEffect, ChangeEvent, FormEvent, JSX } from "react"
import { Task } from "../App"


interface TodoProps{
  id: string,
  name: string,
  completed: boolean,
  toggleTaskCompleted: (id: string) => void,
  deleteTask: (id: string) => void,
  editTask: (id: string, newName: string) => void
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value }, [value]);
  return ref.current;
}

function Todo({
  id,
  name,
  completed,
  toggleTaskCompleted,
  deleteTask,
  editTask,
}: TodoProps): JSX.Element {
    const [isEditing, setEditing] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");

    const editFieldRef = useRef<HTMLInputElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    //ref chỉ tới các phần HTML trong DOM 

    const wasEditing = usePrevious(isEditing);

    /*e: event object đối tượng sự kiện thay đổi input */
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setNewName(e.target.value) //cập nhật setNewName với giá trị trong ô input
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); //ngăn chặn làm mới trang
        editTask(id, newName);
        setNewName("");
        setEditing(false);
    }

    const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="todo-label" htmlFor={id}>
        New name for {name}
      </label>
      <input 
        id={id} 
        className="todo-text" 
        type="text"
        value={newName}
        onChange={handleChange}
        ref={(editFieldRef)} />
    </div>

    <div className="btn-group">
      <button 
        type="button" 
        className="btn todo-cancel"
        onClick={() => setEditing(false)}>
        Cancel
        <span className="visually-hidden">renaming {name}</span>
      </button>

      <button 
        type="submit" 
        className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {name}</span>
      </button>
    </div>
    </form>
    );

    const viewTemplate = (
    <div className="stack-small">
    <div className="c-cb">
      <input
        id={id}
        type="checkbox"
        defaultChecked={completed}
        onChange={() => toggleTaskCompleted(id)}
      />
      <label className="todo-label" htmlFor={id}>
        {name}
      </label>
    </div>

    <div className="btn-group">
      <button 
        type="button" 
        className="btn" 
        onClick={() => setEditing(true)}
        ref={editButtonRef}>
        Edit <span className="visually-hidden">{name}</span>
      </button>

      <button
        type="button"
        className="btn btn__danger"
        onClick={() => deleteTask(id)}>
        Delete <span className="visually-hidden">{name}</span>
      </button>
    </div>
    </div>
    );

    useEffect(() => {
      //?. kiểm tra giá trị tồn tại trước khi cập nhật, trả về undefined nếu không tồn tại
      if (!wasEditing && isEditing) {
        editFieldRef.current?.focus();
      } else if (wasEditing && !isEditing) {
        editButtonRef.current?.focus();
      }
    }, [wasEditing, isEditing]);

  return (
    <li className="todo">
        {isEditing ? editingTemplate : viewTemplate}
    </li>
    );
}

export default Todo;