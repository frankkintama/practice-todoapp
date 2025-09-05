import { useState, ChangeEvent, FormEvent, JSX } from "react";

interface FormProps { addTask: (name: string) => void}

function Form({ addTask }: FormProps): JSX.Element {
    const [name, setName] = useState<string>("");

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTask(name);
    setName("");
    }
    
    return (
    <form onSubmit={handleSubmit}> 
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>

    </form>
  );
}

export default Form;