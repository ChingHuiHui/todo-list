import storage from './Storage'
import './style.css'
import TodoElement from './Todo'
import { STATUS, Todo } from './type'

function uuidv4(): string {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export let todoList: TodoElement[]

export function loadData() {
  todoList = storage.items.map(
    ({ id, content, status }: Todo) => new TodoElement(id, content, status)
  )
}

let inputValue: string = ''

const todoInput = document.querySelector('#todo-input') as HTMLInputElement
const form = document.querySelector('#form') as Element
const todoSection = document.querySelector('.todo-section') as Element

function showTodos(): void {
  todoSection.innerHTML = ''

  let showedTodos: TodoElement[] = [...todoList]

  if (activeTab === 'filter-completed') {
    showedTodos = todoList.filter(({ status }) => status === STATUS.COMPLETED)
  }

  if (activeTab === 'filter-not-completed') {
    showedTodos = todoList.filter(({ status }) => status === STATUS.DEFAULT)
  }

  showedTodos.forEach((todoElement: TodoElement) => {
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
  storage.set(todoList)
  inputValue = ''
  todoInput.value = ''

  showTodos()
})

const tabs = document.querySelectorAll('.tab')
let activeTab = 'filter-all'

tabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    tabs.forEach((tab) => tab.classList.remove('active'))

    const target = e.target as HTMLDivElement

    target.classList.add('active')

    activeTab = target.id

    showTodos()
  })
})

loadData()
showTodos()
