import { BinaryReader } from '../src/index'

import { expect } from 'chai'

function test({
  name,
  reader,
  size,
  min,
  zero,
  max,
  specific,
  nan,
}: {
  name: string
  reader: (r: BinaryReader) => any
  size: number
  min: { bytes: number[]; value: any }
  zero: { bytes: number[]; value: any }
  max: { bytes: number[]; value: any }
  specific: { bytes: number[]; value: any }
  nan?: { bytes: number[]; test: (value: any) => boolean }
}) {
  describe(name, function () {
    it('Offset', function () {
      const data = new BinaryReader(new Uint8Array(size))
      reader(data)
      expect(data.offset).equal(size)
    })

    it('Min value', function () {
      const data = new BinaryReader(new Uint8Array(min.bytes))
      const value = reader(data)
      expect(value).equal(min.value)
    })

    it('Zero value', function () {
      const data = new BinaryReader(new Uint8Array(zero.bytes))
      const value = reader(data)
      expect(value).equal(zero.value)
    })

    it('Max value', function () {
      const data = new BinaryReader(new Uint8Array(max.bytes))
      const value = reader(data)
      expect(value).equal(max.value)
    })

    it('Specific value', function () {
      const data = new BinaryReader(new Uint8Array(specific.bytes))
      const value = reader(data)
      expect(value).equal(specific.value)
    })

    if (typeof nan !== 'undefined') {
      it('NaN', function () {
        const data = new BinaryReader(new Uint8Array(nan.bytes))
        const value = reader(data)
        expect(nan.test(value)).equal(true)
      })
    }
  })
}

test({
  name: 'readUnit8',
  reader: (r) => r.readUint8(),
  size: 1,
  min: { bytes: [0], value: 0 },
  zero: { bytes: [0], value: 0 },
  max: { bytes: [255], value: 255 },
  specific: { bytes: [123], value: 123 },
})

test({
  name: 'readUint8AsString',
  reader: (r) => r.readUint8AsString(),
  size: 1,
  min: { bytes: [0], value: String.fromCharCode(0) },
  zero: { bytes: [0], value: String.fromCharCode(0) },
  max: { bytes: [255], value: String.fromCharCode(255) },
  specific: { bytes: [55], value: '7' },
})

test({
  name: 'readUint8AsBool',
  reader: (r) => r.readUint8AsBool(),
  size: 1,
  min: { bytes: [0], value: false },
  zero: { bytes: [0], value: false },
  max: { bytes: [255], value: true },
  specific: { bytes: [1], value: true },
})

test({
  name: 'readUint16',
  reader: (r) => r.readUint16(),
  size: 2,
  min: { bytes: [0, 0], value: 0 },
  zero: { bytes: [0, 0], value: 0 },
  max: { bytes: [255, 255], value: 65_535 },
  specific: { bytes: [0, 1], value: 256 },
})

test({
  name: 'readUint32',
  reader: (r) => r.readUint32(),
  size: 4,
  min: { bytes: [0, 0, 0, 0], value: 0 },
  zero: { bytes: [0, 0, 0, 0], value: 0 },
  max: { bytes: [255, 255, 255, 255], value: 4_294_967_295 },
  specific: { bytes: [0, 1, 0, 1], value: 16_777_472 },
})

test({
  name: 'readUint64',
  reader: (r) => r.readUint64(),
  size: 8,
  min: { bytes: [0, 0, 0, 0, 0, 0, 0, 0], value: 0n },
  zero: { bytes: [0, 0, 0, 0, 0, 0, 0, 0], value: 0n },
  max: { bytes: [255, 255, 255, 255, 255, 255, 255, 255], value: 18_446_744_073_709_551_615n },
  specific: { bytes: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], value: 72_058_693_566_333_184n },
})

test({
  name: 'readInt8',
  reader: (r) => r.readInt8(),
  size: 1,
  min: { bytes: [0x80], value: -128 },
  zero: { bytes: [0], value: 0 },
  max: { bytes: [0x7f], value: 127 },
  specific: { bytes: [0xb3], value: -77 },
})

test({
  name: 'readInt16',
  reader: (r) => r.readInt16(),
  size: 2,
  min: { bytes: [0x00, 0x80], value: -32_768 },
  zero: { bytes: [0, 0], value: 0 },
  max: { bytes: [0xff, 0x7f], value: 32_767 },
  specific: { bytes: [0xb3, 0xb3], value: -19_533 },
})

test({
  name: 'readInt32',
  reader: (r) => r.readInt32(),
  size: 4,
  min: { bytes: [0x00, 0x00, 0x00, 0x80], value: -2_147_483_648 },
  zero: { bytes: [0, 0, 0, 0], value: 0 },
  max: { bytes: [0xff, 0xff, 0xff, 0x7f], value: 2_147_483_647 },
  specific: { bytes: [0xb3, 0xb3, 0xb3, 0xb3], value: -1_280_068_685 },
})

test({
  name: 'readInt64',
  reader: (r) => r.readInt64(),
  size: 8,
  min: { bytes: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80], value: -9_223_372_036_854_775_808n },
  zero: { bytes: [0, 0, 0, 0, 0, 0, 0, 0], value: 0n },
  max: { bytes: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f], value: 9_223_372_036_854_775_807n },
  specific: { bytes: [0xb3, 0xb3, 0xb3, 0xb3, 0xb3, 0xb3, 0xb3, 0xb3], value: -5_497_853_135_693_827_149n },
})

test({
  name: 'readFloat32',
  reader: (r) => r.readFloat32(),
  size: 4,
  min: { bytes: [0, 0, 128, 255], value: -Infinity },
  zero: { bytes: [0, 0, 0, 0], value: 0 },
  max: { bytes: [0, 0, 128, 127], value: Infinity },
  specific: { bytes: [66, 96, 229, 59], value: 0.007000000216066837 },
  nan: { bytes: [0, 0, 192, 127], test: (v) => isNaN(v) },
})

test({
  name: 'readFloat64',
  reader: (r) => r.readFloat64(),
  size: 8,
  min: { bytes: [0, 0, 0, 0, 0, 0, 240, 255], value: -Infinity },
  zero: { bytes: [0, 0, 0, 0, 0, 0, 0, 0], value: 0 },
  max: { bytes: [0, 0, 0, 0, 0, 0, 240, 127], value: Infinity },
  specific: { bytes: [121, 233, 38, 49, 8, 172, 124, 63], value: 0.007 },
  nan: { bytes: [0, 0, 0, 0, 0, 0, 248, 127], test: (v) => isNaN(v) },
})

describe('readUint8Array', function () {
  it('Offset', function () {
    const arr = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    const data = new BinaryReader(new Uint8Array(arr))
    data.readUint8Array(arr.length)
    expect(data.offset).equal(arr.length)
  })

  it('Empty', function () {
    const arr = new Uint8Array([])
    const data = new BinaryReader(new Uint8Array(arr))
    const value = data.readUint8Array(0)
    expect(value.length).equal(0)
    expect(data.offset).equal(0)
  })

  it('Specific', function () {
    const arr = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    const data = new BinaryReader(new Uint8Array(arr))
    const value = data.readUint8Array(arr.length)
    expect(value).deep.equal(arr)
  })
})

describe('readArrayAsString', function () {
  it('Offset', function () {
    const arr = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    const data = new BinaryReader(new Uint8Array(arr))
    data.readArrayAsString(arr.length)
    expect(data.offset).equal(arr.length)
  })

  it('Empty', function () {
    const arr = new Uint8Array([])
    const data = new BinaryReader(new Uint8Array(arr))
    const value = data.readArrayAsString(0)
    expect(value.length).equal(0)
    expect(data.offset).equal(0)
  })

  it('Specific', function () {
    const arr = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    const data = new BinaryReader(new Uint8Array(arr))
    const value = data.readArrayAsString(arr.length)
    expect(value).equal('Hello World')
  })
})
