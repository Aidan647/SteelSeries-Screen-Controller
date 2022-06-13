import { PngImage, readPngFile } from "node-libpng"
import { AnimationCreateOptions, pixel } from "./types"

export type Frame = pixel[][]

export class Animation {
	/**
	 * Width of the frame
	 */
	readonly width: number
	/**
	 * Height of the frame
	 */
	readonly height: number
	frames: Frame[] = []
	private constructor(image: PngImage, invert: boolean, options: AnimationCreateOptions) {
		this.width = options.width
		this.height = options.height
		// get many images from the png
		// ignore frames that are outside of the image
		for (let y = 0; y + this.height <= image.height; y += this.height) {
			if (y + this.height > image.height) break
			for (let x = 0; x + this.width <= image.width; x += this.width) {
				if (x + this.width > image.width) break
				const frame: Frame = []
				for (let x2 = 0; x2 < this.width; x2++) {
					if (x + x2 >= image.width) break
					const row: pixel[] = []
					for (let y2 = 0; y2 < this.height; y2++) {
						if (y + y2 >= image.height) break
						const color = image.rgbaAt(x + x2, y + y2)
						row.push(invert ? (color[0] <= 100 ? 1 : 0) : color[0] > 100 ? 1 : 0)
					}
					frame.push(row)
				}
				this.frames.push(frame)
			}
		}
		console.log(this.frames.length)
	}
	static async create(path: string, options: AnimationCreateOptions): Promise<Animation>
	static async create(path: string, invert: boolean, options: AnimationCreateOptions): Promise<Animation>
	static async create(
		path: string,
		invert: boolean | AnimationCreateOptions = false,
		options?: AnimationCreateOptions
	): Promise<Animation> {
		if (typeof invert !== "boolean") {
			const image = await readPngFile(path)
			const animation = new Animation(image, false, invert)
			if (animation.frames.length === 0) {
				throw new Error("No frames found")
			}
			return animation
		}
		if (options === undefined) throw new Error("options is required")
		const image = await readPngFile(path)
		const animation = new Animation(image, invert, options)
		if (animation.frames.length === 0) {
			throw new Error("No frames found")
		}
		return animation
	}
	get(frame: number): Frame
	get(frame: number, x: number, y: number): pixel
	get(frame: number, x?: number, y?: number): Frame | pixel {
		if (x === undefined || y === undefined) {
			return this.frames[frame % this.frames.length]
		}
		return this.frames[frame % this.frames.length][y][x]
	}
}
export default Animation
