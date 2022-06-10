import './style.css'

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const todoInput = document.querySelector('#todo-input') as HTMLInputElement
const form = document.querySelector('#form') as Element
const todos = document.querySelector('.todos') as Element

let inputValue: string = ''

todoInput.addEventListener('input', (e: Event) => {
  inputValue = (e.target as HTMLInputElement).value
})

form.addEventListener('submit', (e: Event) => {
  e.preventDefault()

  if (inputValue.trim() === '') {
    alert('please enter todo')
    return
  }

  buildTodo(inputValue)
})

function buildTodo(content: string): void {
  const uuid = uuidv4()

  const todoDiv = document.createElement('div')
  todoDiv.className = 'todo'
  todoDiv.id = uuid

  const statusControl = document.createElement('div')
  statusControl.className = 'status-control'

  const contentBlock = document.createElement('div')
  contentBlock.className = 'content-block'

  const contentText = document.createElement('p')
  const editInput = document.createElement('input')
  editInput.className = 'edit-input'
  contentText.textContent = content
  editInput.value = content

  contentBlock.appendChild(contentText)
  contentBlock.appendChild(editInput)

  todoDiv.appendChild(statusControl)
  todoDiv.appendChild(contentBlock)

  console.log('todoDiv', todoDiv)

  todos.appendChild(todoDiv)

  statusControl.addEventListener('click', (e: PointerEvent) => {
    const targetTodo = e.path.find((e) => e.classList.contains('todo'))

    const isCompleted = targetTodo.classList.contains('completed')

    if (isCompleted) {
      targetTodo.classList.remove('completed')
      return
    }

    targetTodo.classList.add('completed')
  })
}
