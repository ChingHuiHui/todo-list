import './style.css'
import TodoElement from './Todo'

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

let inputValue: string = ''
export let todoList: TodoElement[] = []

export function changeTodoList(changedTodoList: TodoElement[]) {
  todoList = changedTodoList
}

const todoInput = document.querySelector('#todo-input') as HTMLInputElement
const form = document.querySelector('#form') as Element
const todoSection = document.querySelector('.todos') as Element

function showTodos(todoList: TodoElement[]): void {
  todoSection.innerHTML = ''

  todoList.forEach((todoElement: TodoElement) => {
    todoElement.destroy()
    todoElement.init()
    const todo = todoElement.build()
    todoSection.appendChild(todo)
  })
}

todoInput.addEventListener('input', (e: Event) => {
  inputValue = (e.target as HTMLInputElement).value
})

form.addEventListener('submit', (e: Event) => {
  e.preventDefault()

  if (inputValue.trim() === '') {
    alert('please enter todo')
    return
  }

  todoList.push(new TodoElement(uuidv4(), inputValue))
  inputValue = ''
  todoInput.value = ''

  showTodos(todoList)
})

showTodos(todoList)
