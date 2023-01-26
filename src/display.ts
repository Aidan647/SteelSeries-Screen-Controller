import {
	screen,
	pixelColor,
	RectOptions,
	ProgressBarOptions,
	ImageOptions,
	TextOptions,
	AnimationOptions,
	LineOptions,
} from "./types"

export class Display {
	// The display is a singleton class that manages the display.
	static instance: Display | undefined = undefined
	display: screen
	constructor(public width: number, public height: number) {
		// Create the display.
		this.display = Array(this.height)
			.fill(0)
			.map(() => Array(this.width).fill(0))
	}

	/**
	 * Draw a pixel at the given coordinates.
	 * @param color 0 = off, 1 = on (default), -1 = invert
	 */
	drawPixel(x: number, y: number, color: pixelColor = 1): this {
		// if pixel pos is out of display bounds, don't draw it
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return this

		if (color === -1) {
			if (this.display[y][x] === 1) this.display[y][x] = 0
			else this.display[y][x] = 1
			return this
		}

		this.display[y][x] = color

		return this
	}
	/**
	 * Clear the display. (fill with black)
	 */
	clear(): this {
		this.fill(0)
		return this
	}
	/**
	 * Fill the display with the given color.
	 * @param color 0 = off, 1 = on (default), -1 = invert
	 */
	fill(color: pixelColor = 1): this {
		for (let i = 0; i < this.display.length; i++) {
			for (let j = 0; j < this.display[i].length; j++) {
				this.drawPixel(j, i, color)
			}
		}
		return this
	}
	/**
	 * draw a line between the given coordinates.
	 * @param color 0 = off, 1 = on (default), -1 = invert
	 */
	drawLine(options: LineOptions): this {
		var { x, y, x2, y2, color } = options
		const dx = Math.abs(x2 - x)
		const dy = Math.abs(y2 - y)
		const sx = x < x2 ? 1 : -1
		const sy = y < y2 ? 1 : -1
		let err = dx - dy
		while (true) {
			this.drawPixel(x, y, color ?? 1)
			if (x === x2 && y === y2) break
			const e2 = 2 * err
			if (e2 > -dy) {
				err -= dy
				x += sx
			}
			if (e2 < dx) {
				err += dx
				y += sy
			}
		}
		return this
	}
	/**
	 * Draw text on the display.
	 */
	drawText(options: TextOptions): this {
		const { x, y, text, font, color, background } = options
		const vertical_align = options.vertical_align || "top"
		const horizontal_align = options.horizontal_align || "left"

		// calculate the text
		const textArray = text.split("")
		const textLength = textArray.length
		const textHeight = font.height
		const textWidth = textLength * font.width
		const textX =
			horizontal_align === "center" ? x - textWidth / 2 : horizontal_align === "right" ? x - textWidth : x
		const textY =
			vertical_align === "middle" ? y - textHeight / 2 : vertical_align === "bottom" ? y - textHeight : y

		// draw the text
		for (let i = 0; i < textLength; i++) {
			const char = textArray[i]
			const charX = textX + i * font.width
			const charY = textY
			const charData = font.get(char)
			for (let j = 0; j < charData.length; j++) {
				const charRow = charData[j]
				const charRowY = charY + j
				for (let k = 0; k < charRow.length; k++) {
					const charCol = charRow[k]
					const charColX = charX + k
					if (charCol === 1) {
						if (color !== undefined) this.drawPixel(charColX, charRowY, color)
					} else if (charCol === 0) {
						if (background !== undefined) this.drawPixel(charColX, charRowY, background)
					}
				}
			}
		}

		return this
	}
	drawImage(options: ImageOptions): this {
		const { x, y, image, color, background } = options
		if (typeof image === "string") throw new Error("Not implemented")
		// use image.width and image.height
		for (let i = 0; i < image.width; i++) {
			for (let j = 0; j < image.height; j++) {
				if (image.getPixel(i, j) === 1 && color !== undefined) {
					this.drawPixel(x + i, y + j, color)
				} else if (image.getPixel(i, j) === 0 && background !== undefined) {
					this.drawPixel(x + i, y + j, background)
				}
			}
		}

		return this
	}
	drawAnimation(options: AnimationOptions): this {
		const { x, y, color, background } = options
		const frame = "frame" in options ? options.frame : options.animation.get(options.index)
		for (let i = 0; i < frame.length; i++) {
			for (let j = 0; j < frame[i].length; j++) {
				if (frame[i][j] === 1 && color !== undefined) {
					this.drawPixel(x + i, y + j, color)
				} else if (frame[i][j] === 0 && background !== undefined) {
					this.drawPixel(x + i, y + j, background)
				}
			}
		}
		return this
	}
	// drawRect(options: RectOptionsWithEndPos): this
	// drawRect(options: RectOptionsWithDims): this
	drawRect(options: RectOptions): this {
		const { x, y, fill, stroke } = options
		const width = "x2" in options ? options.x2 - x : options.width
		const height = "y2" in options ? options.y2 - y : options.height

		if (options.fill !== undefined) {
			const offset = options.stroke === undefined ? 0 : 1
			for (let i = 0 + offset; i < height - offset; i++) {
				for (let j = 0 + offset; j < width - offset; j++) {
					this.drawPixel(x + j, y + i, options.fill)
				}
			}
		}
		if (options.stroke !== undefined) {
			for (let i = 0; i < height; i++) {
				this.drawPixel(x, y + i, options.stroke)
				this.drawPixel(x + width - 1, y + i, options.stroke)
			}
			for (let i = 0; i < width; i++) {
				this.drawPixel(x + i, y, options.stroke)
				this.drawPixel(x + i, y + height - 1, options.stroke)
			}
		}
		return this
	}
	drawProgressBar(options: ProgressBarOptions): this {
		const { x, y, bar, background, stroke, margin } = options
		// fill bar from bottom to top
		const vertical = options.vertical === undefined ? false : options.vertical
		// reverse the bar direction
		const reverse = options.reverse === undefined ? false : options.reverse
		const width = "x2" in options ? options.x2 - x : options.width
		const height = "y2" in options ? options.y2 - y : options.height
		const offset = (options.stroke === undefined ? 0 : 1) + (margin === undefined ? 0 : 1)

		const progress =
			"progress" in options ? options.progress : (options.value - options.min) / (options.max - options.min)

		if (stroke !== undefined) {
			this.drawRect({ x, y, width, height, stroke })
		}
		if (margin !== undefined) {
			this.drawRect({ x: x + 1, y: y + 1, width: width - 2, height: height - 2, stroke: margin })
		}

		// get left top pos of bar

		const bar2 = {
			x: x + offset,
			y: y + offset,
			width: width - 2 * offset,
			height: height - 2 * offset,
		}
		const barWidth = Math.floor(progress * (width - 2 * offset))
		const barHeight = Math.floor(progress * (height - 2 * offset))
		const verrev = vertical === reverse
		if (bar !== undefined) {
			// if (!vertical && !reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y,
			// 		width: barWidth,
			// 		height: bar2.height,
			// 		fill: bar,
			// 	})
			// } else if (vertical && reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y,
			// 		width: bar2.width,
			// 		height: barHeight,
			// 		fill: bar,
			// 	})
			// } else if (vertical && !reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y + bar2.height - barHeight,
			// 		width: bar2.width,
			// 		height: barHeight,
			// 		fill: bar,
			// 	})
			// } else if (!vertical && reverse) {
			// 	this.drawRect({
			// 		x: bar2.x + bar2.width - barWidth,
			// 		y: bar2.y,
			// 		width: barWidth,
			// 		height: bar2.height,
			// 		fill: bar,
			// 	})
			// }
			this.drawRect({
				x: verrev || !reverse ? bar2.x : bar2.x + bar2.width - barWidth,
				y: verrev || reverse ? bar2.y : bar2.y + bar2.height - barHeight,
				width: vertical ? bar2.width : barWidth,
				height: vertical ? barHeight : bar2.height,
				fill: bar,
			})
		}
		// draw background following the offset
		if (background !== undefined) {
			// if (!vertical && !reverse) {
			// 	this.drawRect({
			// 		x: bar2.x + barWidth,
			// 		y: bar2.y,
			// 		width: bar2.width - barWidth,
			// 		height: bar2.height,
			// 		fill: background,
			// 	})
			// } else if (vertical && reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y + barHeight,
			// 		width: bar2.width,
			// 		height: bar2.height - barHeight,
			// 		fill: background,
			// 	})
			// } else if (vertical && !reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y,
			// 		width: bar2.width,
			// 		height: barHeight,
			// 		fill: background,
			// 	})
			// } else if (!vertical && reverse) {
			// 	this.drawRect({
			// 		x: bar2.x,
			// 		y: bar2.y,
			// 		width: barWidth,
			// 		height: bar2.height,
			// 		fill: background,
			// 	})
			// }

			this.drawRect({
				x: !verrev || reverse ? bar2.x : bar2.x + barWidth,
				y: !verrev || !reverse ? bar2.y : bar2.y + barHeight,
				width: vertical ? bar2.width : reverse ? barWidth : bar2.width - barWidth,
				height: !vertical ? bar2.height : reverse ? barHeight : bar2.height - barHeight,
				fill: background,
			})
		}

		return this
	}

	//get image as png base64 string
	// getImage() {

	// Draw display to the screen.
	/**
	 * @description Get the display data as ready to send to the display.
	 */
	get(): number[] {
		const flattened = this.display.flat()
		// get array of numbers from 0 to 255
		// where each number contains 8 bits of the display
		const displayData = []
		for (let i = 0; i < flattened.length; i += 8) {
			var result = 0
			const byte = flattened.slice(i, i + 8)
			for (let j = 0; j < byte.length; j++) {
				if (byte[j] === 1) {
					result += Math.pow(2, 7 - j)
				}
			}
			displayData.push(result)
		}

		// Send the display to the screen.
		// await sendImage(this.address, displayData)
		return displayData
	}
}
export default Display