import { PngImage, readPngFile } from "node-libpng"
import { pixel } from "./types"

export class Image {
	readonly width: number
	readonly height: number
	pixels: pixel[][] = []
	private constructor(image: PngImage, invert: boolean) {
		this.width = image.width
		this.height = image.height
		for (let y = 0; y < image.height; y++) {
			const row: pixel[] = []
			for (let x = 0; x < image.width; x++) {
				const color = image.rgbaAt(x, y)
				row.push(invert ? (color[0] <= 100 ? 1 : 0) : color[0] > 100 ? 1 : 0)
			}
			this.pixels.push(row)
		}
	}
	static async create(path: string, invert: boolean = false) {
		const image = await readPngFile(path)
		const font = new Image(image, invert)
		return font
	}
	getPixel(x: number, y: number) {
		return this.pixels[y][x]
	}
}
export default Image
