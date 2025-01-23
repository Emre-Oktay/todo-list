export class TodoController {
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
}
