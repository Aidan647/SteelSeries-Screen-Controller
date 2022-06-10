import axios from "axios"

export const registerGame = async (address: string) => {
	const request = {
		game: "TEST_GAME",
		game_display_name: "My testing game",
		developer: "Aidan647",
	}
	return await axios.post(`http://${address}/game_metadata`, request).then(
		(response) => {
			if (response.status === 200) {
				console.log("Game registered")
				return true
			} else {
				console.log("Game registration failed")
				return false
			}
		},
		(error) => {
			console.log("Game registration failed")
			return false
		}
	)
}
export const removeEvent = async (address: string) => {
	const request = {
		game: "TEST_GAME",
		event: "OLED_EVENT",
	}
	return await axios.post(`http://${address}/remove_game_event`, request).then(
		(response) => {
			if (response.status === 200) {
				console.log("Event removed")
				return true
			}
		},
		(error) => {
			console.log("Event removal failed")
			return false
		}
	)
}

export const createEvent = async (address: string) => {
	const request = {
		game: "TEST_GAME",
		event: "OLED_EVENT2",
		value_optional: true,
		handlers: [
			{
				"device-type": "screened-128x36",
				zone: "one",
				mode: "screen",
				datas: [
					{
						"has-text": false,
						"image-data": Array(576).fill(0),
					},
				],
			},
		],
	}
	return await axios.post(`http://${address}/bind_game_event `, request).then(
		(response) => {
			if (response.status === 200) {
				console.log("Event registered")
				return true
			} else {
				console.log("Event registration failed")
				return false
			}
		},
		(error) => {
			console.log("Event registration failed")
			return false
		}
	)
}
export const sendImage = async (address: string, image: number[]) => {
	const request = {
		game: "TEST_GAME",
		event: "OLED_EVENT2",
		data: {
			frame: {
				"image-data-128x36": image,
			},
		},
	}
	return await axios.post(`http://${address}/game_event`, request).then(
		(response) => {
			if (response.status === 200) {
				console.log("Image sent")
				return true
			} else {
				console.log("Image sending failed")
				return false
			}
		},
		(error) => {
			console.log(error)
			console.log("Image sending failed")
			return false
		}
	)
}