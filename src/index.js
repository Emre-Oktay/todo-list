import { TodoController } from './modules/todo-controller.js';
import { ScreenController } from './modules/screen-controller.js';
import { StorageManager } from './modules/storage.js';
import { Todo, List } from './modules/models.js';

import './styles.css';

function initializeFirstTimeSetup() {
    const todoController = new TodoController();

    if (todoController.getAllLists().length === 0) {
        const workList = new List('Work');
        workList.addTodo(new Todo('Welcome to your Todo App!', 'This is an example todo to help you get started.'));
        workList.addTodo(new Todo('Explore Features', 'Try adding and updating todos.'));
        workList.addTodo(new Todo('Try clicking at the todos to see the details', 'Here are the todo details'));

        const hobbiesList = new List('Hobbies');
        hobbiesList.addTodo(new Todo('Start a New Hobby', 'Use this list to track your personal interests.'));

        todoController.addList(workList);
        todoController.addList(hobbiesList);

        StorageManager.saveLists(todoController.getAllLists());
    }

    return todoController;
}

function initializeApp() {
    const todoController = initializeFirstTimeSetup();
    const screenController = new ScreenController(todoController);
    screenController.init();
}

document.addEventListener('DOMContentLoaded', initializeApp);
