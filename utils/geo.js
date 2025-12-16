export function parseEWKBPoint(hex) {
  try {
    if (!hex || typeof hex !== "string") return null
    const buffer = new ArrayBuffer(hex.length / 2)
    const view = new DataView(buffer)
    for (let i = 0; i < hex.length; i += 2) {
      view.setUint8(i / 2, parseInt(hex.substr(i, 2), 16))
    }

    let offset = 0
    const byteOrder = view.getUint8(offset)
    offset += 1
    const littleEndian = byteOrder === 1

    const getUint32 = () => {
      const val = view.getUint32(offset, littleEndian)
      offset += 4
      return val
    }

    const getFloat64 = () => {
      const val = view.getFloat64(offset, littleEndian)
      offset += 8
      return val
    }

    let type = getUint32()
    const hasSRID = (type & 0x20000000) !== 0
    type = type & 0x0FFFFFFF // limpiar flags dejando solo el tipo

    if (hasSRID) {
      // Leer SRID pero no lo usamos de momento
      getUint32()
    }

    // 1 == Point
    if (type !== 1) return null

    const x = getFloat64()
    const y = getFloat64()

    if (isNaN(x) || isNaN(y)) return null
    return { longitude: x, latitude: y }
  } catch (e) {
    console.error("Error al parsear EWKB:", e)
    return null
  }
} 