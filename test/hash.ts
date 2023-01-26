import crypto from 'crypto'

export const hash = (data: any) => crypto.createHash("md5").update(JSON.stringify(data)).digest("hex")
export default hash