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
    constructor(title = '', description = '', dueDate = false, isPriority = false, isComplete = false) {
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

    addList(name) {
        const newList = new List(name);
        this.lists.push(newList);
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

        this.todayNav = document.getElementById('today-nav');
        this.upcomingNav = document.getElementById('upcoming-nav');
        this.importantNav = document.getElementById('important-nav');
        this.activeNav = document.getElementById('active-nav');
        this.completedNav = document.getElementById('completed-nav');

        this.listNav = document.getElementById('list-nav');

        this.newListButton = document.getElementById('new-list');

        this.content = document.getElementById('content-main');

        this.newTodoButton = document.getElementById('new-todo');
    }

    init() {
        this.renderSidebar();
        this.renderToday();
        this.addEventListeners();
    }

    renderSidebar() {
        this.listNav.textContent = '';

        this.todoController.lists.forEach((list, index) => {
            const listElement = document.createElement('div');
            listElement.classList.add('list');

            const listImg = document.createElement('img');
            listImg.src = listImage;
            listImg.alt = 'List';
            listElement.appendChild(listImg);

            const listText = document.createElement('p');
            listText.textContent = list.name;
            listElement.appendChild(listText);

            listElement.addEventListener('click', () => this.renderContent(index));
            this.listNav.appendChild(listElement);
        });
    }

    renderContent(listIndex) {
        this.content.textContent = '';

        const list = this.todoController.getList(listIndex);

        this.content.appendChild(this.renderTodoHead(list.name));
        this.content.appendChild(this.renderTodoList(list.todos));
    }

    renderTodoHead(name, headingSize = 'h1', includeSettings = false) {
        const contentHead = document.createElement('div');
        contentHead.classList.add('content-head');

        const listTitle = document.createElement(headingSize);
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

    renderTodoList(list) {
        const todoList = document.createElement('div');
        todoList.classList.add('todo-list');

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
            //Add event listener to toggle priority status here
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
        this.todayNav.addEventListener('click', () => this.renderToday());
        this.upcomingNav.addEventListener('click', () => this.renderUpcoming());
        this.importantNav.addEventListener('click', () => this.renderImportant());
        this.activeNav.addEventListener('click', () => this.renderActive());
        this.completedNav.addEventListener('click', () => this.renderCompleted());

        this.newListButton.addEventListener('click', () => this.renderNewListModal());
        this.newTodoButton.addEventListener('click', () => this.renderNewTodoModal());
    }

    renderToday() {
        this.content.textContent = '';
        const todayHead = this.renderTodoHead('Today');
        this.content.appendChild(todayHead);

        const lists = this.todoController.getAllLists();
        lists.forEach((list) => {
            const todoHead = this.renderTodoHead(list.name, 'h2');
            this.content.appendChild(todoHead);
            const filteredList = list.todos.filter((todo) => todo.dueDate && isToday(todo.dueDate));
            const todoList = this.renderTodoList(filteredList);
            this.content.appendChild(todoList);
        });
    }

    renderUpcoming() {
        this.content.textContent = '';
        const upcomingHead = this.renderTodoHead('Upcoming');
        this.content.appendChild(upcomingHead);

        const lists = this.todoController.getAllLists();
        const today = new Date();
        const sevenDaysFromNow = addDays(today, 7);
        lists.forEach((list) => {
            const todoHead = this.renderTodoHead(list.name, 'h2');
            this.content.appendChild(todoHead);
            const filteredList = list.todos.filter(
                (todo) => todo.dueDate && isWithinInterval(todo.dueDate, { start: today, end: sevenDaysFromNow })
            );
            const todoList = this.renderTodoList(filteredList);
            this.content.appendChild(todoList);
        });
    }

    renderImportant() {
        this.content.textContent = '';
        const importantHead = this.renderTodoHead('Important');
        this.content.appendChild(importantHead);

        const lists = this.todoController.getAllLists();
        lists.forEach((list) => {
            const todoHead = this.renderTodoHead(list.name, 'h2');
            this.content.appendChild(todoHead);
            const filteredList = list.todos.filter((todo) => todo.isPriority);
            const todoList = this.renderTodoList(filteredList);
            this.content.appendChild(todoList);
        });
    }

    renderActive() {
        this.content.textContent = '';
        const activeHead = this.renderTodoHead('Active');
        this.content.appendChild(activeHead);

        const lists = this.todoController.getAllLists();
        lists.forEach((list) => {
            const todoHead = this.renderTodoHead(list.name, 'h2');
            this.content.appendChild(todoHead);
            const filteredList = list.todos.filter((todo) => !todo.isComplete);
            const todoList = this.renderTodoList(filteredList);
            this.content.appendChild(todoList);
        });
    }

    renderCompleted() {
        this.content.textContent = '';
        const completedHead = this.renderTodoHead('Completed');
        this.content.appendChild(completedHead);

        const lists = this.todoController.getAllLists();
        lists.forEach((list) => {
            const todoHead = this.renderTodoHead(list.name, 'h2');
            this.content.appendChild(todoHead);
            const filteredList = list.todos.filter((todo) => todo.isComplete);
            const todoList = this.renderTodoList(filteredList);
            this.content.appendChild(todoList);
        });
    }
}

const todoController = new TodoController();
const screenController = new ScreenController(todoController);

todoController.addList('Work');
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

document.addEventListener('DOMContentLoaded', () => {
    screenController.init();
});
