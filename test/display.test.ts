import { assert, describe, expect, it, test } from "vitest"
import display from "../src/display"
import hash from "./hash"

describe.concurrent("get empty", () => {
	const Display = new display(128, 36)
	it.concurrent("is display", () => {
		expect(Display).toBeInstanceOf(display)
	})
	it.concurrent("right size of display array", () => {
		expect(Display.display.length).toBe(36)
		expect(Display.display[0].length).toBe(128)
	})
	it.concurrent("right values in display array", () => {
		expect(Display.display).toStrictEqual(new Array(36).fill(new Array(128).fill(0)))
	})

})
describe.concurrent("get empty", () => {
	it.each([
		{ height: 36, expected: "6caaeb2541619910cfa8666733682f43" },
		{ height: 40, expected: "eff3035557efab849bf0f2dc1f5c2e77" },
		{ height: 48, expected: "6b8e57f2b22b03db559d5ba3807451fa" },
	])("128x$height", ({ height, expected }) => {
		const Display = new display(128, height)
		const data = Display.get()
		expect(hash(data)).toBe(expected)
		expect(data).toStrictEqual(new Array((128 * height) / 8).fill(0))
	})
})
describe.concurrent("set pixel", () => {
	it.each([
		{ x: 0, y: -1, expected: "6caaeb2541619910cfa8666733682f43" },
		{ x: -1, y: 0, expected: "6caaeb2541619910cfa8666733682f43" },
		{ x: -1, y: -1, expected: "6caaeb2541619910cfa8666733682f43" },
		{ x: 0, y: 0, expected: "37a72c474db6ad08352b254691d702af" },
		{ x: 0, y: 1, expected: "1ad2f8cc119825ce487c873877aa2a14" },
		{ x: 1, y: 0, expected: "e44dde98523cfe26e60382a3581320df" },
		{ x: 1, y: 1, expected: "413617b531afd5bb3246ee63ba5a175c" },
	])("$x, $y", ({ x, y, expected }) => {
		const Display = new display(128, 36)
		Display.drawPixel(x, y, 1)
		expect(hash(Display.get())).toBe(expected)
	})
})
describe.concurrent("fill", () => {
	it.each([
		{ color: 0, expected: "6caaeb2541619910cfa8666733682f43" },
		{ color: 1, expected: "9a31b3473735fba518c50934745ef670" },
		{ color: -1, expected: "9a31b3473735fba518c50934745ef670" },
	] as const)("$x, $y", ({ color, expected }) => {
		const Display = new display(128, 36)
		Display.fill(color)
		expect(hash(Display.get())).toBe(expected)
	})
})
// describe.concurrent("clear", () => {
// 	it.concurrent("128", () => {
// 		const Display = new display(128, 36)
// 		Display.fill(1)
// 		expect(hash(Display.get())).toBe("9a31b3473735fba518c50934745ef670")
// 		Display.fill(0)
// 		expect(hash(Display.get())).toBe("6caaeb2541619910cfa8666733682f43")
// 		Display.fill(-1)
// 		expect(hash(Display.get())).toBe("9a31b3473735fba518c50934745ef670")
// 		Display.fill(1)
// 		expect(hash(Display.get())).toBe("6caaeb2541619910cfa8666733682f43")
// 	})
// })
// describe.concurrent("drawRect", () => {
// 	const Display = new display(128, 36)
// 	Display.drawRect({ x: 7, y: 0, width: 40, height: 10, fill: 1 })
// 	expect(hash(Display.get())).toBe("7a4913ba39ed7968e6b0e60b2b7ec7e9")
// 	Display.drawRect({ x: 2, y: 3, width: 30, height: 20, fill: 0 })
// 	expect(hash(Display.get())).toBe("b0cdf527104528e309a11a1b36467112")
// 	Display.drawRect({ x: 1, y: 3, width: 60, height: 25, fill: -1 })
// 	expect(hash(Display.get())).toBe("03ffb6a3f5d8843f2c5be5c98a1348b1")
// 	Display.drawRect({ x: 6, y: 3, width: 70, height: 30, fill: -1 })
// 	expect(hash(Display.get())).toBe("dd846d8b413d7dc369bd8850cfd14561")
// })
