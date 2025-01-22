import './styles.css';

import { format, isToday, addDays, isWithinInterval } from 'date-fns';

import listImage from './assets/list.svg';
import dotsImage from './assets/three-dots.svg';
import circleImage from './assets/circle.svg';
import checkCircleImage from './assets/check-circle.svg';
import dateImage from './assets/calendar.svg';
import priorityImage from './assets/flag.svg';
import priorityCheckImage from './assets/flag-red.svg';
import threeDotsImage from './assets/three-dots.svg';

class List {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index) {
        if (index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);
        }
    }

    updateTodo(index, updatedTodo) {
        if (index >= 0 && index < this.todos.length) {
            this.todos[index] = updatedTodo;
        }
    }

    getTodo(index) {
        return this.todos[index];
    }

    getAllTodos() {
        return this.todos;
    }
}

class Todo {
    constructor(title = '', description = '', dueDate = null, isPriority = false, isComplete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isPriority = isPriority;
        this.isComplete = isComplete;
    }
}

class TodoController {
    constructor() {
        this.lists = [];
    }

    addList(list) {
        this.lists.push(list);
    }

    deleteList(index) {
        if (index >= 0 && index < this.lists.length) {
            this.lists.splice(index, 1);
        }
    }

    getList(index) {
        return this.lists[index];
    }

    getAllLists() {
        return this.lists;
    }

    addTodoToList(listIndex, todo) {
        if (listIndex >= 0 && listIndex < this.lists.length) {
            this.lists[listIndex].addTodo(todo);
        }
    }

    deleteTodoFromList(listIndex, todoIndex) {
        if (listIndex >= 0 && listIndex < this.lists.length) {
            this.lists[listIndex].deleteTodo(todoIndex);
        }
    }

    updateTodoInList(listIndex, todoIndex, updatedTodo) {
        if (listIndex >= 0 && listIndex < this.lists.length) {
            this.lists[listIndex].updateTodo(todoIndex, updatedTodo);
        }
    }
}

class ScreenController {
    constructor(todoController) {
        this.todoController = todoController;
        this.content = document.getElementById('content-main');
    }

    init() {
        this.renderSidebar();
        this.renderListContent(this.todoController.getList(0));
        this.addEventListeners();
    }

    renderSidebar() {
        this.listNav = document.getElementById('list-nav');

        this.listNav.textContent = '';

        this.todoController.lists.forEach((list, index) => {
            const listElement = document.createElement('div');
            listElement.classList.add('list');
            listElement.dataset.index = index;

            const listImg = document.createElement('img');
            listImg.src = listImage;
            listImg.alt = 'List';
            listElement.appendChild(listImg);

            const listText = document.createElement('p');
            listText.textContent = list.name;
            listElement.appendChild(listText);

            this.listNav.appendChild(listElement);
        });

        this.listNav.addEventListener('click', (e) => {
            const listElement = e.target.closest('.list');
            if (listElement) {
                const index = parseInt(listElement.dataset.index, 10);
                this.renderListContent(this.todoController.getList(index));
            }
        });
    }

    renderListContent(list) {
        this.content.textContent = '';

        this.currentList = list;

        this.content.appendChild(this.renderTodoHead(list.name, true));
        this.content.appendChild(this.renderTodoList(list.todos));
    }

    renderTodoHead(name, includeSettings = false, listIndex = null) {
        const contentHead = document.createElement('div');
        contentHead.classList.add('content-head');

        const listTitle = document.createElement('h1');
        listTitle.classList.add('title');
        listTitle.textContent = name;
        contentHead.appendChild(listTitle);

        if (includeSettings) {
            const titleSettings = document.createElement('img');
            titleSettings.src = dotsImage;
            titleSettings.alt = 'Settings';
            contentHead.appendChild(titleSettings);
        }

        return contentHead;
    }

    renderTodoSubHead(name) {
        const subHead = document.createElement('div');
        subHead.classList.add('content-sub-head');

        const listTitle = document.createElement('h2');
        listTitle.classList.add('title');
        listTitle.textContent = name;
        subHead.appendChild(listTitle);

        const titleSettings = document.createElement('img');
        titleSettings.src = dotsImage;
        titleSettings.alt = 'Settings';
        subHead.appendChild(titleSettings);

        return subHead;
    }

    renderTodoList(list) {
        const todoList = document.createElement('div');
        todoList.classList.add('todo-list');

        if (list.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No todos to show. Add a new todo to get started!';
            emptyMessage.classList.add('empty-message'); // Optional: Add a class for styling
            todoList.appendChild(emptyMessage);
            return todoList;
        }

        list.forEach((todo) => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo-item');

            const statusImg = document.createElement('img');
            if (todo.isComplete) {
                statusImg.src = checkCircleImage;
                statusImg.alt = 'Unset completed';
            } else {
                statusImg.src = circleImage;
                statusImg.alt = 'Set completed';
            }
            statusImg.addEventListener('click', () => {
                todo.isComplete = !todo.isComplete;
                if (todo.isComplete) {
                    statusImg.src = checkCircleImage;
                    statusImg.alt = 'Unset completed';
                } else {
                    statusImg.src = circleImage;
                    statusImg.alt = 'Set completed';
                }
            });
            todoDiv.appendChild(statusImg);

            const todoMainDiv = document.createElement('div');
            todoMainDiv.classList.add('todo-item-main');

            const todoTitle = document.createElement('p');
            todoTitle.textContent = todo.title;
            todoMainDiv.appendChild(todoTitle);

            if (todo.dueDate) {
                const dateDiv = document.createElement('div');
                dateDiv.classList.add('todo-date');

                const dateImg = document.createElement('img');
                dateImg.src = dateImage;
                dateImg.alt = 'Date';
                dateDiv.appendChild(dateImg);

                const dateText = document.createElement('p');
                dateText.textContent = format(todo.dueDate, 'dd/MM/yyyy');
                dateDiv.appendChild(dateText);

                todoMainDiv.appendChild(dateDiv);
            }

            todoDiv.appendChild(todoMainDiv);

            const priorityImg = document.createElement('img');
            if (todo.isPriority) {
                priorityImg.src = priorityCheckImage;
                priorityImg.alt = 'Unset importance';
            } else {
                priorityImg.src = priorityImage;
                priorityImg.alt = 'Set importance';
            }
            priorityImg.addEventListener('click', () => {
                todo.isPriority = !todo.isPriority;
                if (todo.isPriority) {
                    priorityImg.src = priorityCheckImage;
                    priorityImg.alt = 'Unset importance';
                } else {
                    priorityImg.src = priorityImage;
                    priorityImg.alt = 'Set importance';
                }
            });

            todoDiv.appendChild(priorityImg);

            const settingsImg = document.createElement('img');
            settingsImg.src = threeDotsImage;
            settingsImg.alt = 'Settings';
            //Add event listener to open update todo modal here
            todoDiv.appendChild(settingsImg);

            todoList.appendChild(todoDiv);
        });

        return todoList;
    }

    addEventListeners() {
        const todayNav = document.getElementById('today-nav');
        const upcomingNav = document.getElementById('upcoming-nav');
        const importantNav = document.getElementById('important-nav');
        const activeNav = document.getElementById('active-nav');
        const completedNav = document.getElementById('completed-nav');

        todayNav.addEventListener('click', () => this.renderFilteredTodos('Today', (todo) => isToday(todo.dueDate)));
        upcomingNav.addEventListener('click', () => {
            const today = new Date();
            const sevenDaysFromNow = addDays(today, 7);
            this.renderFilteredTodos(
                'Upcoming',
                (todo) => todo.dueDate && isWithinInterval(todo.dueDate, { start: today, end: sevenDaysFromNow })
            );
        });
        importantNav.addEventListener('click', () => this.renderFilteredTodos('Important', (todo) => todo.isPriority));
        activeNav.addEventListener('click', () => this.renderFilteredTodos('Active', (todo) => !todo.isComplete));
        completedNav.addEventListener('click', () => this.renderFilteredTodos('Completed', (todo) => todo.isComplete));

        this.TodoDialog = document.getElementById('todo-dialog');

        const newTodoButton = document.getElementById('new-todo');
        newTodoButton.addEventListener('click', () => this.renderNewTodoModal());

        this.todoCloseButton = document.getElementById('todo-close-button');

        this.todoCloseButton.addEventListener('click', () => this.TodoDialog.close());

        const todoForm = document.getElementById('todo-form');
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTodo();
        });

        this.ListDialog = document.getElementById('list-dialog');

        const newListButton = document.getElementById('new-list');
        newListButton.addEventListener('click', () => this.renderNewListModal());

        this.listCloseButton = document.getElementById('list-close-button');

        this.listCloseButton.addEventListener('click', () => this.ListDialog.close());

        const listForm = document.getElementById('list-form');
        listForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveList();
        });
    }

    renderFilteredTodos(title, filterFn) {
        this.content.textContent = '';
        const head = this.renderTodoHead(title);
        this.content.appendChild(head);

        const lists = this.todoController.getAllLists();
        lists.forEach((list) => {
            const filteredTodos = list.todos.filter(filterFn);
            if (filteredTodos.length > 0) {
                const subHead = this.renderTodoSubHead(list.name);
                this.content.appendChild(subHead);
                const todoList = this.renderTodoList(filteredTodos);
                this.content.appendChild(todoList);
            }
        });
    }

    renderNewTodoModal() {
        const modalTitle = document.getElementById('todo-modal-title');
        modalTitle.textContent = 'Create a New Todo';
        this.TodoDialog.showModal();
    }

    saveTodo() {
        const list = this.currentList;

        const titleInput = document.getElementById('todo-title');
        const descriptionInput = document.getElementById('todo-description');
        const dueDateInput = document.getElementById('todo-due-date');
        const priorityInput = document.getElementById('todo-priority');

        const title = titleInput.value || '';
        const description = descriptionInput.value || '';
        const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : null;
        const priority = priorityInput.checked || false;

        const todo = new Todo(title, description, dueDate, priority);
        list.addTodo(todo);

        this.TodoDialog.close();
        this.renderListContent(list);

        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
        priorityInput.checked = false;
    }

    renderNewListModal() {
        const modalTitle = document.getElementById('list-modal-title');
        modalTitle.textContent = 'Create a New List';
        this.ListDialog.showModal();
    }

    saveList() {
        const titleInput = document.getElementById('list-title');
        const title = titleInput.value || '';
        const newList = new List(title);
        this.todoController.addList(newList);

        this.ListDialog.close();
        this.renderSidebar();
        this.renderListContent(newList);

        console.log(this.todoController.getAllLists());

        titleInput.value = '';
    }
}

const todoController = new TodoController();
const screenController = new ScreenController(todoController);

todoController.addList(new List('Work'));
todoController.getList(0).addTodo(new Todo('Example todo', 'This is an example todo', false, false, false));
todoController
    .getList(0)
    .addTodo(new Todo('Example todo with date', 'This is an example todo', new Date(), false, false));
todoController
    .getList(0)
    .addTodo(
        new Todo('Example todo with another date', 'This is an example todo', addDays(new Date(), 2), false, false)
    );
todoController
    .getList(0)
    .addTodo(new Todo('Example todo with priority', 'This is an example todo', false, true, false));
todoController.getList(0).addTodo(new Todo('Example completed todo', 'This is an example todo', false, false, true));

todoController.addList(new List('Hobbies'));
todoController.getList(1).addTodo(new Todo('Example todo for hobbies', 'This is an example todo', false, false, false));

document.addEventListener('DOMContentLoaded', () => {
    screenController.init();
});
