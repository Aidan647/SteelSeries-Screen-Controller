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

export type EndPos = { x2: number; y2: number }

export type Dimensions = { width: number; height: number }

type Rect = {
	fill?: pixelColor
	stroke?: pixelColor
}
type ProgressBar = {
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


// export type RectOptionsWithDims = OptionsWithDims & RectOptions
// export type RectOptionsWithEndPos = OptionsWithEndPos & RectOptions

export type RectOptions = startPos & (EndPos | Dimensions) & Rect
export type ProgressBarOptions = startPos &
	(EndPos | Dimensions) &
	ProgressBar

// {
// 		x: number
// 		y: number
// 		width: number
// 		height: number
// 		fill?: pixelColor
// 		stroke?: pixelColor
//   }
// | {
// 		x: number
// 		y: number
// 		x2: number
// 		y2: number
// 		fill?: pixelColor
// 		stroke?: pixelColor
//   }
