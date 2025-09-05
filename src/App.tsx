import Todo from "./components/Todo"
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import { useState, useRef, useEffect, JSX } from "react";
import { nanoid } from "nanoid";

//export: cho phép Task được import từ file khác
//interface định nghĩa thuộc tính của task gồm id, name, completed
export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

/*Union type: định nghĩa biến nào có FilterName chỉ được phép là 1 trong 3 
giá trị dưới */
type FilterName = "All" | "Active" | "Completed";

//hàm FilterFunction nhận vào đối số task có kiểu Task và trả true hoặc false
type FilterFunction = (task: Task) => boolean;

//AppProps là kiểu dữ liệu của "props" được truyền vào component App
/*Hàm nói rằng bất kì component nào dùng Task phải nhận 1 prop tên tasks 
và thực hiện các mảng của Task*/
interface AppProps { tasks: Task[];}

/* Hàm nhận vào một biến value generic T (string, number, boolean, etc.) và trả về
giá trị T của value hoặc undefined*/
function usePrevious<T>(value: T): T | undefined {
  //useRef có giá trị undefined
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value }, [value]);
  return ref.current;
}

const FILTER_MAP: Record<FilterName, FilterFunction>/*Record<Keys, Type*/ = {
  All: () => true, /*hiển thị tất cả các task*/
  Active: (task) => !task.completed, /*trả true nếu task.completed false*/ 
  Completed: (task) => task.completed /*trả true nếu task.completed true*/
}

const FILTER_NAMES: FilterName[] = Object.keys(FILTER_MAP) as FilterName[]; /*cho TS
hiểu rõ roàng là lấy keys từ Array của FilterName */

/*Component App nhận prop tên task với Task[] đổi tên sang initialTasks. */
function App({ tasks: initialTasks }: AppProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // giá trị Task []
  const [filter, setFilter] = useState<FilterName>("All"); //giá trị "All"


  function addTask(name: string) {
    const newTask: Task = {
      id: `todo-${nanoid()}`, /*tạo chuỗi id có dạng todo-xxxxxx với xxxxxx là 
      chuỗi ngẫu nhiên được tạo bời nano id */
      name, 
      completed:false};
    setTasks([...tasks, newTask]); //tạo bản sao task và chạy newTask
  }

  //tasks.map(...) duyệt từng task
  function toggleTaskCompleted(id: string) {
    const updatedTasks = tasks.map((task) => 
      //so sánh id ? tạo bản sao và đổi sang chưa hoàn thành : giữ nguyên
      id === task.id ? {...task, completed: !task.completed} : task
    );
    setTasks(updatedTasks)
  }


  //Delete task that match with its IDs
  function deleteTask(id: string) {
    //tạo mảng mới chỉ chứa task có id khác với task muốn xóa
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id: string, newName: string) {
  const editedTaskList = tasks.map((task) => 
    //so sánh id ? tạo bản sao và đổi tên sang mới : giữ nguyên
    id === task.id ? {...task, name: newName } : task
  );
  setTasks(editedTaskList);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter]) //lọc danh sách task chưa hoàn thành theo bộ filter FILTER_MAP
  .map((task) => ( //duyệt mỗi task để đưa vào component Todo
    <Todo 
      id={task.id} 
      name={task.name} 
      completed={task.completed} 
      key={task.id} 
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask} 
      editTask={editTask} />));

  const filterList = FILTER_NAMES.map((name) => ( //duyệt name dựa theo FILTER_MAP để đưa vào component FilterButton
    <FilterButton 
      key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={() => setFilter(name)}/*chỉ gọi khi người dùng nhấn nút filter*/  />
  ))


  //nếu số task không phải 1 ? dùng tasks : dùng task
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";

  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  
  const listHeadingRef = useRef<HTMLHeadingElement>(null);

  const prevTaskLength = usePrevious<number>(tasks.length);

  useEffect(() => {
  //độ dài task ngắn hơn độ dài trước đó
  if (prevTaskLength !== undefined && tasks.length < prevTaskLength) {
    //?. kiểm tra giá trị tồn tại trước khi cập nhật, trả về undefined nếu không tồn tại
    listHeadingRef.current?.focus();
  }
  }, [tasks.length, prevTaskLength]);


  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">{filterList}</div>

      <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef}>
        {headingText}
      </h2>
      
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;