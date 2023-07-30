//@ts-check

import {
	createEditor, createFileName, createFontSize, createMenu,
	createOpenFile, createPrinter, createSaveFile
} from './create.js'
import createFinder from './Finder.js'

/**
 * The Main function
 */
async function main() {
	const menu = createMenu()
	const editor = createEditor()
	const fileName = await createFileName(menu)
	createOpenFile(menu, editor, fileName)
	createSaveFile(menu, editor, fileName)
	createPrinter(menu)
	createFontSize(menu, editor)
	createFinder(menu, editor)
}

window.addEventListener("load", main)

