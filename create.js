//@ts-check

/**
 * Create The menubar
 * @returns {HTMLMenuElement}
 */
export function createMenu() {
	const header = document.createElement('header')
	document.body.append(header)

	const menu = document.createElement('menu')
	header.append(menu)
	menu.role = 'menubar'
	return menu
}


/**
 * @param {HTMLSelectElement} select
 * @param {string} value
 */
function addSelectOption(select, value, text = value) {
	const opt = document.createElement("option")
	opt.textContent = text
	opt.value = value
	select.add(opt)
}

/**
 * @param {HTMLMenuElement} menu
 * @returns {HTMLLIElement}
 */
export function createMenuItem(menu) {
	const menuItem = document.createElement('li')
	menu.append(menuItem)
	menuItem.role = 'menuitem'
	return menuItem
}

export function createEditor() {
	const editor = document.createElement('pre')
	document.body.appendChild(editor)
	editor.contentEditable = 'true'
	editor.id = "editor"
	return editor
}

/**
 * @param {HTMLMenuElement} menu
 * @param {HTMLPreElement} editor
 */
export function createFontSize(menu, editor) {
	const menuitem = createMenuItem(menu)
	const fontSize = document.createElement('select')
	menuitem.appendChild(fontSize)
	Object.entries({
		['xx-small']: 'Very Very Small',
		['x-small']: 'Very Very Small',
		small: 'Small',
		medium: 'Medium',
		large: 'Large',
		['x-large']: 'Very Large',
		['xx-large']: 'Very Very Large',
		['xxx-large']: 'Very Very Very Large',
	}).forEach(([key, value]) => {
		addSelectOption(fontSize, key, value)
	})
	fontSize.value = 'medium'
	fontSize.addEventListener('change', async function () {
		editor.style.fontSize = fontSize.value
	})
}

/**
 * @param {HTMLMenuElement} menu
 */
export function createPrinter(menu) {
	const menuitem = createMenuItem(menu)
	const print = document.createElement('button')
	menuitem.appendChild(print)
	print.textContent = 'Print'
	print.addEventListener('click', async function () {
		window.print()
	})
}

/**
 * @param {HTMLMenuElement} menu
 * @param {HTMLPreElement} editor
 * @param {HTMLInputElement} fileName
 */
export function createSaveFile(menu, editor, fileName) {
	const menuitem = createMenuItem(menu)
	const save = document.createElement('button')
	menuitem.appendChild(save)
	save.textContent = 'Save'
	save.addEventListener('click',
		async function () {
			saveFile(editor.textContent ?? "", fileName.value)
		}
	)
}

/**
 * @param {HTMLMenuElement} menu
 * @param {HTMLPreElement} editor
 * @param {HTMLInputElement} fileName
 */
export function createOpenFile(menu, editor, fileName) {
	const menuitem = createMenuItem(menu)
	const fileInput = document.createElement('input')
	fileInput.type = 'file'
	fileInput.id = 'fileInput'
	const label = document.createElement('label')
	label.textContent = 'Open'
	label.htmlFor = fileInput.id
	fileInput.addEventListener('change', async function () {
		const files = this.files ?? new FileList()
		const file = files[0]
		editor.textContent = await file.text()
		fileName.value = file.name
	})
	menuitem.appendChild(label)
	menuitem.appendChild(fileInput)
}

/**
 * @param {HTMLMenuElement} menu
 */
export async function createFileName(menu) {
	const menuitem = createMenuItem(menu)
	const fileName = document.createElement('input')
	menuitem.append(fileName)
	fileName.type = "text"
	fileName.value = "untitled"
	async function title() {
		return document.title = `Text Editor - ${this.value}`
	}
	fileName.addEventListener("input", title)
	await title.call(fileName)
	return fileName
}

/**
 * @param {BlobPart} content
 * @param {string} filename
 */
function saveFile(content, filename) {
	const blob = new Blob([content], { type: 'text/plain' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}
