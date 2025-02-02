import { Todo, List } from './models.js';
import { FilterTypes, Icons } from './utils.js';
import { format } from 'date-fns';

export class ScreenController {
    constructor(todoController) {
        this.todoController = todoController;
        this.content = document.getElementById('content');
        this.currentList = null;
        this.currentTodo = null;
    }

    init() {
        this.renderSidebar();
        this.renderListContent(this.todoController.getList(0));
        this.setActiveNav(document.querySelector(`.nav-item[data-index="0"]`));
        this.addEventListeners();
    }

    renderSidebar() {
        this.listNav = document.getElementById('list-nav');

        this.listNav.textContent = '';

        this.todoController.lists.forEach((list, index) => {
            const listElement = document.createElement('div');
            listElement.classList.add('nav-item');
            listElement.dataset.index = index;

            const listImg = document.createElement('img');
            listImg.src = Icons.LIST;
            listImg.alt = 'List';
            listElement.appendChild(listImg);

            const listText = document.createElement('p');
            listText.textContent = list.name;
            listElement.appendChild(listText);

            this.listNav.appendChild(listElement);
        });

        this.listNav.addEventListener('click', (e) => {
            const listElement = e.target.closest('.nav-item');
            if (listElement) {
                const index = parseInt(listElement.dataset.index, 10);
                this.renderListContent(this.todoController.getList(index));
                this.setActiveNav(listElement);
            }
        });
    }

    renderListContent(list) {
        this.content.textContent = '';
        const contentMain = document.createElement('div');
        contentMain.classList.add('content-main');

        this.currentList = list;

        contentMain.appendChild(this.renderTodoHead(list.name, true));
        contentMain.appendChild(this.renderTodoList(list.todos));
        this.content.appendChild(contentMain);
        this.content.appendChild(this.renderNewTodoButton());
    }

    renderTodoHead(name, includeSettings = false) {
        const contentHead = document.createElement('div');
        contentHead.classList.add('content-head');

        const listTitle = document.createElement('h1');
        listTitle.classList.add('title');
        listTitle.textContent = name;
        contentHead.appendChild(listTitle);

        if (includeSettings) {
            const titleSettings = document.createElement('img');
            titleSettings.src = Icons.DOTS;
            titleSettings.alt = 'Settings';
            contentHead.appendChild(titleSettings);
            titleSettings.addEventListener('click', () => this.renderListUpdateModal(this.currentList));
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
        titleSettings.src = Icons.DOTS;
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

        list.forEach((todo, index) => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo-item');

            const statusImg = document.createElement('img');
            if (todo.isComplete) {
                statusImg.src = Icons.CHECK_CIRCLE;
                statusImg.alt = 'Unset completed';
            } else {
                statusImg.src = Icons.CIRCLE;
                statusImg.alt = 'Set completed';
            }
            statusImg.addEventListener('click', () => {
                todo.isComplete = !todo.isComplete;
                if (todo.isComplete) {
                    statusImg.src = Icons.CHECK_CIRCLE;
                    statusImg.alt = 'Unset completed';
                } else {
                    statusImg.src = Icons.CIRCLE;
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
                dateImg.src = Icons.DATE;
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
                priorityImg.src = Icons.PRIORITY_CHECK;
                priorityImg.alt = 'Unset importance';
            } else {
                priorityImg.src = Icons.PRIORITY;
                priorityImg.alt = 'Set importance';
            }
            priorityImg.addEventListener('click', () => {
                todo.isPriority = !todo.isPriority;
                if (todo.isPriority) {
                    priorityImg.src = Icons.PRIORITY_CHECK;
                    priorityImg.alt = 'Unset importance';
                } else {
                    priorityImg.src = Icons.PRIORITY;
                    priorityImg.alt = 'Set importance';
                }
            });

            todoDiv.appendChild(priorityImg);

            const settingsImg = document.createElement('img');
            settingsImg.src = Icons.THREE_DOTS;
            settingsImg.alt = 'Settings';
            settingsImg.addEventListener('click', () => {
                this.renderTodoUpdateModal(todo, index);
                this.currentTodo = todo;
            });
            todoDiv.appendChild(settingsImg);

            todoDiv.addEventListener('click', (e) => {
                if (!e.target.matches('img')) {
                    this.toggleTodoDescription(todo, todoMainDiv);
                }
            });

            todoList.appendChild(todoDiv);
        });

        return todoList;
    }

    renderNewTodoButton() {
        const newTodoDiv = document.createElement('div');
        newTodoDiv.classList.add('new-todo');
        newTodoDiv.id = 'new-todo';

        const plusImg = document.createElement('img');
        plusImg.src = Icons.PLUS;
        plusImg.alt = 'Create a new todo';
        newTodoDiv.appendChild(plusImg);

        const newTodoText = document.createElement('p');
        newTodoText.textContent = 'New todo';
        newTodoDiv.appendChild(newTodoText);

        newTodoDiv.addEventListener('click', () => this.renderNewTodoModal());

        return newTodoDiv;
    }

    addEventListeners() {
        const todayNav = document.getElementById('today-nav');
        const upcomingNav = document.getElementById('upcoming-nav');
        const importantNav = document.getElementById('important-nav');
        const activeNav = document.getElementById('active-nav');
        const completedNav = document.getElementById('completed-nav');

        todayNav.addEventListener('click', () => {
            this.renderFilteredTodos('Today', FilterTypes.TODAY);
            this.setActiveNav(todayNav);
        });
        upcomingNav.addEventListener('click', () => {
            this.renderFilteredTodos('Upcoming', FilterTypes.UPCOMING);
            this.setActiveNav(upcomingNav);
        });
        importantNav.addEventListener('click', () => {
            this.renderFilteredTodos('Important', FilterTypes.IMPORTANT);
            this.setActiveNav(importantNav);
        });
        activeNav.addEventListener('click', () => {
            this.renderFilteredTodos('Active', FilterTypes.ACTIVE);
            this.setActiveNav(activeNav);
        });
        completedNav.addEventListener('click', () => {
            this.renderFilteredTodos('Completed', FilterTypes.COMPLETED);
            this.setActiveNav(completedNav);
        });

        this.TodoDialog = document.getElementById('todo-dialog');

        this.todoCloseButton = document.getElementById('todo-close-button');

        this.todoCloseButton.addEventListener('click', () => {
            this.TodoDialog.close();
            const deleteButton = document.getElementById('todo-delete-button');
            if (deleteButton) {
                deleteButton.parentNode.removeChild(deleteButton);
            }
        });

        const todoForm = document.getElementById('todo-form');
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTodo();
        });

        this.ListDialog = document.getElementById('list-dialog');

        const newListButton = document.getElementById('new-list');
        newListButton.addEventListener('click', () => this.renderNewListModal());

        this.listCloseButton = document.getElementById('list-close-button');

        this.listCloseButton.addEventListener('click', () => {
            this.ListDialog.close();
            const deleteButton = document.getElementById('list-delete-button');
            if (deleteButton) {
                deleteButton.parentNode.removeChild(deleteButton);
            }
        });

        const listForm = document.getElementById('list-form');
        listForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveList();
        });
    }

    renderFilteredTodos(title, filterFn) {
        this.content.textContent = '';
        const contentMain = document.createElement('div');
        contentMain.classList.add('content-main');
        const head = this.renderTodoHead(title);
        contentMain.appendChild(head);

        const lists = this.todoController.getAllLists();
        if (lists.length == 0) {
            const noListsText = document.createElement('p');
            noListsText.textContent = 'You dont have any lists currently, Add a new list to get started!';
            contentMain.appendChild(noListsText);
        }
        lists.forEach((list) => {
            const filteredTodos = list.todos.filter(filterFn);
            if (filteredTodos.length > 0) {
                const subHead = this.renderTodoSubHead(list.name);
                contentMain.appendChild(subHead);
                const todoList = this.renderTodoList(filteredTodos);
                contentMain.appendChild(todoList);
            }
        });
        this.content.appendChild(contentMain);
    }

    renderNewTodoModal() {
        const modalTitle = document.getElementById('todo-modal-title');
        modalTitle.textContent = 'Create a New Todo';
        this.clearTodoModal();
        this.TodoDialog.showModal();
    }

    clearTodoModal() {
        const titleInput = document.getElementById('todo-title');
        const descriptionInput = document.getElementById('todo-description');
        const dueDateInput = document.getElementById('todo-due-date');
        const priorityInput = document.getElementById('todo-priority');

        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
        priorityInput.checked = false;

        const deleteButton = document.getElementById('todo-delete-button');
        if (deleteButton) {
            deleteButton.parentNode.removeChild(deleteButton);
        }
    }

    saveTodo() {
        const titleInput = document.getElementById('todo-title');
        const descriptionInput = document.getElementById('todo-description');
        const dueDateInput = document.getElementById('todo-due-date');
        const priorityInput = document.getElementById('todo-priority');

        const title = titleInput.value || '';
        const description = descriptionInput.value || '';
        const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : null;
        const priority = priorityInput.checked || false;

        if (this.currentTodo) {
            this.currentTodo.title = title;
            this.currentTodo.description = description;
            this.currentTodo.dueDate = dueDate;
            this.currentTodo.isPriority = priority;

            this.currentTodo = null;
        } else {
            const todo = new Todo(title, description, dueDate, priority);
            this.currentList.addTodo(todo);
        }
        this.todoController.saveToStorage();

        this.TodoDialog.close();
        this.renderListContent(this.currentList);

        this.clearTodoModal();
    }

    renderNewListModal() {
        const modalTitle = document.getElementById('list-modal-title');
        modalTitle.textContent = 'Create a New List';
        this.clearListModal();
        this.ListDialog.showModal();
    }

    clearListModal() {
        const nameInput = document.getElementById('list-name');
        nameInput.value = '';
        const deleteButton = document.getElementById('list-delete-button');
        this.listUpdate = false;
        if (deleteButton) {
            deleteButton.parentNode.removeChild(deleteButton);
        }
    }

    saveList() {
        const nameInput = document.getElementById('list-name');
        const name = nameInput.value || '';

        if (this.listUpdate) {
            this.currentList.name = name;
            this.todoController.saveToStorage();
            this.listUpdate = false;
            this.renderListContent(this.currentList);
        } else {
            const newList = new List(name);
            this.todoController.addList(newList);
            this.renderListContent(newList);
        }

        this.ListDialog.close();
        this.renderSidebar();

        if (!this.listUpdate) {
            const lastIndex = this.todoController.lists.length - 1;
            const newListNav = document.querySelector(`.nav-item[data-index="${lastIndex}"]`);
            this.setActiveNav(newListNav);
        }

        this.clearListModal();
    }

    renderTodoUpdateModal(todo, index) {
        const modalTitle = document.getElementById('todo-modal-title');
        modalTitle.textContent = 'Update Todo';

        const titleInput = document.getElementById('todo-title');
        const descriptionInput = document.getElementById('todo-description');
        const dueDateInput = document.getElementById('todo-due-date');
        const priorityInput = document.getElementById('todo-priority');

        titleInput.value = todo.title;
        descriptionInput.value = todo.description;
        dueDateInput.value = todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '';
        priorityInput.checked = todo.isPriority;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Todo';
        deleteButton.classList.add('delete-button');
        deleteButton.id = 'todo-delete-button';
        deleteButton.addEventListener('click', () => {
            this.currentList.deleteTodo(index);
            this.todoController.saveToStorage();
            this.renderListContent(this.currentList);
            this.TodoDialog.close();
            const modalContent = document.getElementById('todo-modal-content');
            modalContent.removeChild(deleteButton);
        });
        const modalContent = document.getElementById('todo-modal-content');
        modalContent.appendChild(deleteButton);

        this.TodoDialog.showModal();
    }

    renderListUpdateModal(list) {
        this.listUpdate = true;

        const modalTitle = document.getElementById('list-modal-title');
        modalTitle.textContent = 'Update List';

        const nameInput = document.getElementById('list-name');
        nameInput.value = list.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete List';
        deleteButton.classList.add('delete-button');
        deleteButton.id = 'list-delete-button';

        deleteButton.addEventListener('click', () => {
            const index = this.todoController.getAllLists().indexOf(list);
            this.todoController.deleteList(index);
            this.renderSidebar();
            this.renderFilteredTodos('Today', FilterTypes.TODAY);
            this.setActiveNav(document.getElementById('today-nav'));
            this.ListDialog.close();
            const modalContent = document.getElementById('list-modal-content');
            modalContent.removeChild(deleteButton);
        });
        const modalContent = document.getElementById('list-modal-content');
        modalContent.appendChild(deleteButton);

        this.ListDialog.showModal();
    }

    toggleTodoDescription(todo, todoMainDiv) {
        const existingDescription = todoMainDiv.querySelector('.todo-description');
        if (!existingDescription) {
            const todoDescription = document.createElement('p');
            todoDescription.textContent = todo.description;
            todoDescription.classList.add('todo-description');
            todoMainDiv.appendChild(todoDescription);
        } else {
            todoMainDiv.removeChild(existingDescription);
        }
    }

    setActiveNav(element) {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach((item) => {
            item.classList.remove('nav-active');
        });

        if (element && element.classList.contains('nav-item')) {
            element.classList.add('nav-active');
        }
    }
}
