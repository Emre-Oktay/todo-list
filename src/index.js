import { TodoController } from './todo-controller.js';
import { ScreenController } from './screen-controller.js';
import { Todo, List } from './models.js';
import { addDays } from 'date-fns';

import './styles.css';

function initializeApp() {
    const todoController = new TodoController();
    const screenController = new ScreenController(todoController);

    // Pre-populate with initial lists and todos
    const workList = new List('Work');
    workList.addTodo(new Todo('Example todo', 'This is an example todo'));
    workList.addTodo(new Todo('Example todo with date', 'This is an example todo', new Date()));
    workList.addTodo(new Todo('Example todo with another date', 'This is an example todo', addDays(new Date(), 2)));
    workList.addTodo(new Todo('Example todo with priority', 'This is an example todo', null, true));
    workList.addTodo(new Todo('Example completed todo', 'This is an example todo', null, false, true));

    todoController.addList(workList);

    const hobbiesList = new List('Hobbies');
    hobbiesList.addTodo(new Todo('Example todo for hobbies', 'This is an example todo'));
    todoController.addList(hobbiesList);

    screenController.init();
}

document.addEventListener('DOMContentLoaded', initializeApp);
