import { createMenuItem } from './create.js'

class Find {
	/**
	 * @type {HTMLSpanElement[]}
	 */
	highlightSpans
	/**
	 * @type {Number|undefined}
	 */
	currentIndex
	/**
	 * @param {Node} editor
	 */
	constructor(editor) {
		this.editor = editor
		editor.addEventListener('input', () => this.findAll())
		this.search = ''
	}

	get search() {
		return this._search
	}

	set search(newSearch) {
		if (this._search === newSearch) {
			return
		}
		this._search = newSearch
		this.findAll()
	}

	get currentHighlight() {
		if (this.currentIndex !== undefined) {
			return this.highlightSpans[this.currentIndex]
		}
	}

	/**
	 * @param {Range} range
	 */
	highlight(range) {
		const highlight = document.createElement('span')
		highlight.style.backgroundColor = 'green'
		range.surroundContents(highlight)
		this.highlightSpans.push(highlight)
		return highlight
	}

	/**
	 * 
	 * @param {boolean} preserveIndex 
	 */
	clear(preserveIndex = false) {
		this.highlightSpans?.forEach(element => {
			element.parentNode?.replaceChild(element.firstChild ?? document.createTextNode(""), element)
		})
		this.editor.normalize()
		this.highlightSpans = []

		if (!preserveIndex) {
			this.currentIndex = undefined
		}
	}

	/**
	 * 
	 * @param {boolean} preserveIndex 
	 */
	findAll(preserveIndex = false) {
		this.clear(preserveIndex)

		if (this.search === "") {
			return
		}

		var textNode = this.editor.firstChild
		var content = textNode?.textContent ?? ""
		var index = content.indexOf(this.search)

		while (textNode !== null && index !== -1) {
			const range = document.createRange()

			range.setStart(textNode, index)
			range.setEnd(textNode, index + this.search.length)
			var highlight = this.highlight(range)

			textNode = highlight.nextSibling
			content = textNode?.textContent ?? ""
			index = content.indexOf(this.search)
		}
	}

	/**
	 * 
	 */
	selectCurrent() {
		const highlight = this.currentHighlight
		if (highlight !== undefined) {
			const range = document.createRange()
			range.selectNode(highlight)

			const selection = window.getSelection()
			selection?.removeAllRanges()
			selection?.addRange(range)

			highlight.scrollIntoView({ behavior: 'smooth' })
		}
	}
	/**
	 * 
 	*/
	findNext() {
		this.currentIndex = this.normalizeIndex((this.currentIndex ?? -1) + 1)
		this.selectCurrent()
	}

	/**
	 * 
	 */
	findPrev() {
		this.currentIndex = this.normalizeIndex((this.currentIndex ?? 0) - 1)
		this.selectCurrent()
	}

	/**
	 * @param {number} index
	 */
	normalizeIndex(index) {
		return ((index % this.highlightSpans.length) + this.highlightSpans.length) % this.highlightSpans.length
	}

	/**
	 * 
	 * @param {string} text 
	 */
	replace(text = "") {
		const highlight = this.currentHighlight
		if (highlight !== undefined) {
			this.selectCurrent()
			highlight.textContent = text
			this.findAll(true)
		}
	}

	/**
	 * 
	 * @param {string} text 
	 */
	replaceAll(text = "") {
		this.highlightSpans.forEach(element => {
			element.textContent = text
		})
		this.findAll(true)
	}
}

/**
 * @param {HTMLMenuElement} menu
 * @param {Node} editor
 */
export default function createFinder(menu, editor) {
	const menuitem = createMenuItem(menu)

	const find = document.createElement('input')
	find.placeholder = "Find"
	find.type = "search"
	const findPrev = document.createElement('button')
	findPrev.textContent = "\u2191"
	const findNext = document.createElement('button')
	findNext.textContent = "\u2193"
	const replace = document.createElement('input')
	replace.placeholder = "Replace"
	replace.type = "search"
	const replaceAll = document.createElement('button')
	replaceAll.textContent = "Replace All"
	const replaceNext = document.createElement('button')
	replaceNext.textContent = "Replace"
	menuitem.append(find, findPrev, findNext, replace, replaceNext, replaceAll)

	const finder = new Find(editor)

	find.addEventListener("input", async function () {
		finder.search = this.value
	})

	findPrev.addEventListener('click', async function () {
		finder.findPrev()
	})

	findNext.addEventListener('click', async function () {
		finder.findNext()
	})

	replaceNext.addEventListener('click', async function () {
		finder.replace(replace.value ?? "")
	})

	replaceAll.addEventListener('click', async function () {
		finder.replaceAll(replace.value ?? "")
	})
}
