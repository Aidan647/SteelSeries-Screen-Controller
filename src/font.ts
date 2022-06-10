import { readPngFile } from "node-libpng"
import { pixel } from "./types"



export class Font {
	letters: { [key: string]: pixel[][] } = {}
	readonly width: number = this.size[0]
	readonly height: number = this.size[1]
	private constructor(public path: string, public size: [number, number]) {}
	static async create(path: string, size: [number, number]) {
		const font = new Font(path, size)
		await font.load()
		return font
	}
	private async load() {
		// load font from image
		const image = await readPngFile(this.path)
		// const color = image.rgbaAt(0, 0)
		// load each letter from image
		// read letters from left to right then top to bottom
		for (let y = 0; y < 16; y++) {
			for (let x = 0; x < 16; x++) {
				const letter: pixel[][] = []
				for (let i = 0; i < this.height; i++) {
					const row: pixel[] = []
					for (let j = 0; j < this.width; j++) {
						const color = image.rgbaAt(x * this.width + j, i + this.height * y)
						row.push(color[0] > 100 ? 1 : 0)
					}
					letter.push(row)
				}
				this.letters[x + y * 16] = letter
			}
		}
		// console.log(this.letters)
		// console.log(this.letters)
		// console.log(String.fromCharCode(10))
	}

}