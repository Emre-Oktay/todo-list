export class Todo {
    constructor(title = '', description = '', dueDate = null, isPriority = false, isComplete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isPriority = isPriority;
        this.isComplete = isComplete;
    }

    toggleComplete() {
        this.isComplete = !this.isComplete;
    }

    togglePriority() {
        this.isPriority = !this.isPriority;
    }
}

export class List {
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
}
