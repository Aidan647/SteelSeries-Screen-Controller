import AnimationClass from "./animation"
import { Font } from "./font"
import ImageClass from "./image"
import { Frame } from "./animation"

export type steelSeriesSettings = {
	address: string
	encryptedAddress?: string
	ggEncryptedAddress?: string
	mercstealthAddress?: string
}

export type pixelColor = -1 | 0 | 1
export type pixel = 0 | 1
export type screen = pixel[][]

export type startPos = {
	x: number
	y: number
}

type endPos = { x2: number; y2: number }
type dimensions = { width: number; height: number }

type rect = {
	fill?: pixelColor
	stroke?: pixelColor
}
type progressBar = {
	vertical?: boolean
	reverse?: boolean
	bar?: pixelColor
	background?: pixelColor
	stroke?: pixelColor
	margin?: pixelColor
} & (
	| {
			min: number
			max: number
			value: number
	  }
	| {
			progress: number
	  }
)
type color = {
	color?: pixelColor
}
type alignment = {
	vertical_align?: "top" | "middle" | "bottom"
	horizontal_align?: "left" | "center" | "right"
}
type image = {
	image: ImageClass
}
type animation =
	| {
			animation: AnimationClass
			index: number
	  }
	| {
			frame: Frame
	  }

// export type RectOptionsWithDims = OptionsWithDims & RectOptions
// export type RectOptionsWithEndPos = OptionsWithEndPos & RectOptions

// export type PixelOptions = startPos & Color

export type LineOptions = startPos & endPos & color

export type RectOptions = startPos & (endPos | dimensions) & rect

export type ProgressBarOptions = startPos & (endPos | dimensions) & progressBar

export type ImageOptions = startPos & { color?: pixelColor; background?: pixelColor } & image

export type AnimationOptions = startPos & { color?: pixelColor; background?: pixelColor } & animation

export type AnimationCreateOptions = dimensions

export type TextOptions = startPos & alignment & color & { text: string; font: Font; background?: pixelColor }

// 	| {
// 	height: number
// 	width: number
// 	rows: number
// 	cols: number
// }
