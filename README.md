
# SteelSeries Screen Controller

Controller for oled screens on SteelSeries Devices


## Installation

Install with npm

```bash
npm install steelseries-screen-controller
```


    
### Documentation

[github wiki page](https://github.com/Aidan647/SteelSeries-Screen-Controller/wiki) 
## Example

```typescript
import { Display, Font } from "steelseries-screen-controller";
// or
const { Display, Font } = require("steelseries-screen-controller");

(async () => {
	const display = new Display(128, 36) // create Display object with 128x36 pixel resolution (for Rival 700/710)

	const font = await Font.create("./8x8.png") // load custom font from 8x8.png

	// draw "Hello World!" in the center of the display
	display.drawText({
		x: display.width / 2,
		y: display.height / 2,
		font: font, // use custom font loaded previously
		color: 1, // use color 1 (white)
		text: "Hello World!",
		vertical_align: "middle",
		horizontal_align: "center",
	})
	// result is "ready to use" in SteelSeries GameSense™ SDK (<array of length 576>)
	const result = display.get()
})()
```


## License

[CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/)