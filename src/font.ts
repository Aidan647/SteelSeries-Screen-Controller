import { PngImage, readPngFile } from "node-libpng"
import { pixel } from "./types"



export class Font {
	letters: { [key: string]: pixel[][] } = {}
	readonly width: number
	readonly height: number
	private constructor(image: PngImage, invert: boolean) {
		// image is 16x16 of images
		if (image.width % 16 !== 0) throw new Error("Font image width must be a multiple of 16")
		if (image.height % 16 !== 0) throw new Error("Font image height must be a multiple of 16")
		this.width = image.width / 16
		this.height = image.height / 16
		for (let y = 0; y < 16; y++) {
			for (let x = 0; x < 16; x++) {
				const letter: pixel[][] = []
				for (let i = 0; i < this.height; i++) {
					const row: pixel[] = []
					for (let j = 0; j < this.width; j++) {
						const color = image.rgbaAt(x * this.width + j, i + this.height * y)
						row.push(invert ? (color[0] <= 100 ? 1 : 0) : (color[0] > 100 ? 1 : 0))
					}
					letter.push(row)
				}
				this.letters[x + y * 16] = letter
			}
		}
	}
	static async create(path: string, invert: boolean = false) {
		const image = await readPngFile(path)
		const font = new Font(image, invert)
		return font
	}
	get(char: string) {
		return this.letters[char.charCodeAt(0)]
	}
}