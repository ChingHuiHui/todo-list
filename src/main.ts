import storage from './Storage'
import './style.css'
import TodoElement from './Todo'
import { STATUS, Todo } from './type'
import { v4 as uuid } from 'uuid'

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

  todoList.push(new TodoElement(uuid(), inputValue))
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
