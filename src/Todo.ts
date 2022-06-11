import { changeTodoList, todoList } from './main'
import { STATUS, Todo } from './type'

export default class TodoElement implements Todo {
  #statusControl: HTMLDivElement
  #todoDiv: HTMLDivElement
  #contentBlock: HTMLDivElement
  #editBtn: HTMLButtonElement
  #deleteBtn: HTMLButtonElement

  constructor(
    public id: string,
    public content: string,
    public status: STATUS = STATUS.DEFAULT
  ) {}

  get isCompleted(): boolean {
    return this.status === STATUS.COMPLETED
  }

  get isEditable(): boolean {
    return this.#todoDiv.classList.contains('edit')
  }

  buildTodoDiv(): void {
    this.#todoDiv.className = 'todo'
    this.#todoDiv.id = this.id
  }

  buildStatusControl(): void {
    this.#statusControl.className = 'status-control'

    if (this.isCompleted) {
      this.#todoDiv.classList.add('completed')
      this.#editBtn.disabled = true
    }

    this.#statusControl.addEventListener('click', () => this.toggle())
  }

  toggle(): void {
    if (this.isCompleted) {
      this.#todoDiv.classList.remove('completed')
      this.status = STATUS.DEFAULT
      this.#editBtn.disabled = false

      return
    }

    this.#todoDiv.classList.add('completed')
    this.status = STATUS.COMPLETED
    this.#editBtn.disabled = true
  }

  buildContentBlock(): void {
    this.#contentBlock.className = 'content-block'

    const contentText = document.createElement('p')
    const editInput = document.createElement('input')
    editInput.className = 'edit-input'
    contentText.textContent = this.content
    editInput.value = this.content

    editInput.addEventListener('input', (e: Event) => {
      const value = (e.target as HTMLInputElement).value

      contentText.textContent = value
      editInput.value = value
      this.content = value
    })

    this.#contentBlock.appendChild(contentText)
    this.#contentBlock.appendChild(editInput)
  }

  buildEditBtn(): void {
    this.#editBtn.textContent = 'Edit'
    this.#editBtn.addEventListener('click', () => this.edit())
  }

  edit(): void {
    if (this.isEditable) {
      this.#todoDiv.classList.remove('edit')
      this.#editBtn.textContent = 'Edit'
      return
    }

    this.#editBtn.textContent = 'OK'
    this.#todoDiv.classList.add('edit')
  }

  buildDeleteBtn(): void {
    this.#deleteBtn.textContent = 'Delete'
    this.#deleteBtn.addEventListener('click', () => this.delete())
  }

  delete(): void {
    changeTodoList(todoList.filter(({ id }) => id !== this.id))
    this.destroy()
  }

  init(): void {
    this.#todoDiv = document.createElement('div')
    this.#statusControl = document.createElement('div')
    this.#contentBlock = document.createElement('div')
    this.#editBtn = document.createElement('button')
    this.#deleteBtn = document.createElement('button')
  }

  build(): HTMLDivElement {
    this.buildTodoDiv()
    this.buildStatusControl()
    this.buildContentBlock()
    this.buildEditBtn()
    this.buildDeleteBtn()

    this.#todoDiv.appendChild(this.#statusControl)
    this.#todoDiv.appendChild(this.#contentBlock)
    this.#todoDiv.appendChild(this.#editBtn)
    this.#todoDiv.appendChild(this.#deleteBtn)

    return this.#todoDiv
  }

  destroy(): void {
    ;[
      this.#todoDiv,
      this.#statusControl,
      this.#contentBlock,
      this.#editBtn,
      this.#deleteBtn,
    ].forEach((el) => el && el.remove())

    // this.#editBtn.removeEventListener('click', this.edit)
    // this.#deleteBtn.removeEventListener('click', this.delete)
    // this.#statusControl.removeEventListener('click', this.toggle)
  }
}
