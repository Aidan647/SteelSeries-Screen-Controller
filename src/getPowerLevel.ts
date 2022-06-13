import HID from "node-hid"

HID.setDriverType("libusb")

const series = [
	[4152, 0x12ad], // Arctis 7 2019
	[4152, 0x1260], // Arctis 7 2017
	[4152, 0x1252], // Arctis Pro
	[4152, 0x12b3], // Actris 1 Wireless
	[4152, 0x12c2], // Arctis 9
]
/**
 * tries to get Arctis headset power level
 * @deprecated
 */
export const getPercentage = () => {
	const devices = HID.devices().filter((d) => {
		return series.some((s) => {
			return d.vendorId === s[0] && d.productId === s[1] && d.usage !== 1
		})
	})
	const result: [HID.Device, number][] = []

	for (var i = 0; i < devices.length; i++) {
		const device = devices[i]
		if (!device.path) continue
		const data = new HID.HID(device.path)

		if (!data) {
			continue
		}

		try {
			data.write([0x06, 0x18])
			var report = data.readSync()
			result.push([device, report[2]])
		} catch (error) {
			console.log("Error: Cannot write to Arctis Wireless device. Please replug the device.")
		}

		data.close()
	}
	return result
}
