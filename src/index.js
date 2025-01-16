import './styles.css';

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
    constructor(title = '', description = '', dueDate = false, priority = false, isComplete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
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
    constructor() {
        this.todoController = new TodoController();

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
        this.renderContent();
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

    renderContent(listIndex = 0) {
        this.content.textContent = '';

        const list = this.todoController.getList(listIndex);

        this.content.appendChild(renderTodoHead(list.name));
        this.content.appendChild(renderTodoList(list));
    }

    renderTodoHead(name) {
        const contentHead = document.createElement('div');
        contentHead.classList.add('content-head');

        const listTitle = document.createElement('h1');
        listTitle.classList.add('title');
        listTitle.textContent = name;
        contentHead.appendChild(listTitle);

        const titleSettings = document.createElement('img');
        titleSettings.src = dotsImage;
        titleSettings.alt = 'Settings';
        contentHead.appendChild(titleSettings);

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
            //Add event listener to toggle completion status here
            todoDiv.appendChild(statusImg);

            const todoMainDiv = document.createElement('div');
            todoMainDiv.classList.add('todo-item-main');

            const todoTitle = document.createElement('p');
            todoTitle.textContent = todo.name;
            todoMainDiv.appendChild(todoTitle);

            if (!todo.dueDate) {
                const dateDiv = document.createElement('div');
                dateDiv.classList.add('todo-div');

                const dateImg = document.createElement('img');
                dateImg.src = dateImage;
                dateImg.alt = 'Date';
                dateDiv.appendChild(dateImg);

                const dateText = document.createElement('p');
                dateText.textContent = todo.dueDate;
                dateDiv.appendChild(dateText);

                todoMainDiv.appendChild(dateDiv);
            }

            todoDiv.appendChild(todoMainDiv);

            const priorityImg = document.createElement('img');
            if (todo.priority) {
                priorityImg.src = priorityCheckImage;
                priorityImg.alt = 'Unset importance';
            } else {
                priorityImg.src = priorityImage;
                priorityImg.alt = 'Set importance';
            }
            //Add event listener to toggle priority status here
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
        this.todayNav.addEventListener('click', () => renderToday());
        this.upcomingNav.addEventListener('click', () => renderUpcoming());
        this.importantNav.addEventListener('click', () => renderImportant());
        this.activeNav.addEventListener('click', () => renderActive());
        this.completedNav.addEventListener('click', () => renderCompleted());

        this.newListButton.addEventListener('click', () => renderNewListModal());
        this.newTodoButton.addEventListener('click', () => renderNewTodoModal());
    }
}
