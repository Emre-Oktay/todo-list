import './styles.css';

class project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
    }

    getTodo(index) {
        return this.todos[index];
    }

    getAllTodos() {
        return this.todos;
    }
}

class Todo {
    constructor(title = '', description = '', dueDate = new Date(), priority = 0, isComplete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = isComplete;
    }
}
