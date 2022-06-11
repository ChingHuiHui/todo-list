import { loadData } from './main'
import storage from './Storage'
import { STATUS, Todo } from './type'

export default class TodoElement implements Todo {
  #statusControl: HTMLDivElement
  #todoDiv: HTMLDivElement
  #contentBlock: HTMLInputElement
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

  #store() {
    storage.setItem({
      id: this.id,
      content: this.content,
      status: this.status,
    })
  }

  #buildTodoDiv(): void {
    this.#todoDiv.className = 'todo'
    this.#todoDiv.id = this.id
  }

  #buildStatusControl(): void {
    this.#statusControl.className = 'status-control'

    if (this.isCompleted) {
      this.#todoDiv.classList.add('completed')
      this.#editBtn.disabled = true
    }

    this.#statusControl.addEventListener('click', () => this.#toggle())
  }

  #toggle(): void {
    if (this.isCompleted) {
      this.#todoDiv.classList.remove('completed')
      this.status = STATUS.DEFAULT
      this.#editBtn.disabled = false

      this.#store()

      return
    }

    this.#todoDiv.classList.add('completed')
    this.status = STATUS.COMPLETED
    this.#editBtn.disabled = true

    this.#store()
  }

  #buildContentBlock(): void {
    this.#contentBlock.className = 'edit-input'
    this.#contentBlock.readOnly = true
    this.#contentBlock.value = this.content

    this.#contentBlock.addEventListener('input', (e: Event) => {
      const value = (e.target as HTMLInputElement).value

      this.#contentBlock.value = value
      this.content = value

      this.#store()
    })
  }

  #buildEditBtn(): void {
    this.#editBtn.textContent = 'Edit'
    this.#editBtn.addEventListener('click', () => this.#edit())
  }

  #edit(): void {
    if (this.isEditable) {
      this.#todoDiv.classList.remove('edit')
      this.#editBtn.textContent = 'Edit'
      this.#contentBlock.readOnly = true
      return
    }

    this.#editBtn.textContent = 'OK'
    this.#todoDiv.classList.add('edit')
    this.#contentBlock.readOnly = false
  }

  #buildDeleteBtn(): void {
    this.#deleteBtn.textContent = 'Delete'
    this.#deleteBtn.addEventListener('click', () => this.#delete())
  }

  #delete(): void {
    storage.set(storage.items.filter(({ id }) => id !== this.id))

    loadData()
    this.destroy()
  }

  init(): void {
    this.#todoDiv = document.createElement('div')
    this.#statusControl = document.createElement('div')
    this.#contentBlock = document.createElement('input')
    this.#editBtn = document.createElement('button')
    this.#deleteBtn = document.createElement('button')
  }

  build(): HTMLDivElement {
    this.#buildTodoDiv()
    this.#buildStatusControl()
    this.#buildContentBlock()
    this.#buildEditBtn()
    this.#buildDeleteBtn()

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
