import { StorageManager } from './storage.js';

export class TodoController {
    constructor() {
        this.lists = StorageManager.loadLists();
    }

    addList(list) {
        this.lists.push(list);
        this.saveToStorage();
    }

    deleteList(index) {
        if (index >= 0 && index < this.lists.length) {
            this.lists.splice(index, 1);
            this.saveToStorage();
        }
    }

    getList(index) {
        return this.lists[index];
    }

    getAllLists() {
        return this.lists;
    }

    saveToStorage() {
        StorageManager.saveLists(this.lists);
    }
}
