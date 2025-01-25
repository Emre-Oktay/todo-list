import { Todo, List } from './models.js';

export class StorageManager {
    static LISTS_STORAGE_KEY = 'todoAppLists';

    static saveLists(lists) {
        try {
            const serializedLists = lists.map((list) => ({
                name: list.name,
                todos: list.todos.map((todo) => ({
                    title: todo.title,
                    description: todo.description,
                    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
                    isPriority: todo.isPriority,
                    isComplete: todo.isComplete,
                })),
            }));

            localStorage.setItem(this.LISTS_STORAGE_KEY, JSON.stringify(serializedLists));
        } catch (error) {
            console.error('Error saving lists to localStorage:', error);
        }
    }

    static loadLists() {
        try {
            const storedLists = localStorage.getItem(this.LISTS_STORAGE_KEY);

            if (!storedLists) return [];

            const parsedLists = JSON.parse(storedLists).map((listData) => {
                const list = new List(listData.name);

                listData.todos.forEach((todoData) => {
                    const todo = new Todo(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate ? new Date(todoData.dueDate) : null,
                        todoData.isPriority,
                        todoData.isComplete
                    );
                    list.addTodo(todo);
                });

                return list;
            });

            return parsedLists;
        } catch (error) {
            console.error('Error loading lists from localStorage:', error);
            return [];
        }
    }

    static clearLists() {
        try {
            localStorage.removeItem(this.LISTS_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}
