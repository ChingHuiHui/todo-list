import { Todo } from './type'

class Storage {
  get items(): Todo[] {
    return JSON.parse(localStorage.getItem('todoList') as string) || []
  }

  set(todoList: Todo[]): void {
    localStorage.setItem('todoList', JSON.stringify(todoList))
  }

  getItem(targetId: string): Todo | undefined {
    return this.items.find(({ id }) => id === targetId)
  }

  setItem(todo: Todo): void {
    const updatedItems = [...this.items]
    const itemIndex = updatedItems.findIndex(({ id }) => id === todo.id)
    updatedItems[itemIndex] = todo

    localStorage.setItem('todoList', JSON.stringify(updatedItems))
  }
}

const storage = new Storage()

export default storage
