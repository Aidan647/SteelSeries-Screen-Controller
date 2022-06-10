import fs from "fs/promises"
import path from "path"
import { steelSeriesSettings } from "./types"
import { Display } from "./display"
import { Font } from "./font"
import { sendImage } from "./events"
import { getPercentage } from "./getPowerLevel"

const options = {
	location: "C:/ProgramData/SteelSeries/SteelSeries Engine 3/coreProps.json",
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
;(async () => {
	const data = await fs.readFile(options.location, "utf8").then((data) => JSON.parse(data) as steelSeriesSettings)
	console.log(data)
	const font = await Font.create(path.join(__dirname, "../fonts/16x32.png"), [16, 32])
	const fontSmall = await Font.create(path.join(__dirname, "../fonts/04x06.png"), [4, 6])

	const display = Display.getInstance(data.address)
	// //get time
	// const time = new Date()
	// const timeString = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`

	// align the text to the right and middle of the display
	// display.drawText(timeString, font, display.width - font.width * timeString.length, 3)

	// console.log(getPercentage())
	// const precentage = getPercentage()
	// if (precentage[0]) {
	// 	const power = precentage[0][1]
	// 	// @ts-ignore
	// 	const device = precentage[0][0]["product"]
	// 	display.drawText(`${device}:`, fontSmall)
	// 	display.drawText(`${power}%`, font, 0, fontSmall.height)

	// }
	display.drawLine(0, 0, display.width, display.height, 1)
	display.drawProgressBar({
		x: 10,
		y: 10,
		x2: 90,
		y2: 20,
		bar: 1,
		stroke: 1,
		vertical: false,
		reverse: false,
		progress: 0.5,
		margin: 0,
	})
	await sendImage(data.address, display.get())
})()
