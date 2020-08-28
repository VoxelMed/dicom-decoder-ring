/**
 *
 * @param bitsAllocated
 * @param planarConfiguration - [Planar Configuration (0028,0006)]{@link https://dicom.innolitics.com/ciods/segmentation/image-pixel/00280006}: 1 if color-by-plane, 0 if color-by-pixel
 * @param size
 * @param samplesPerPixel
 * @param encodedPixelData
 */
function decodeRle(
    encodedPixelData: Uint8Array,
    bitsAllocated: number,
    planarConfiguration: number,
    size: { rows: number; columns: number },
    samplesPerPixel: number,
    pixelRepresentation: number,
) {
    if (bitsAllocated === 8) {
        const decodedPixelData =
            planarConfiguration === 1
                ? _decode8Planar(encodedPixelData, size, samplesPerPixel)
                : _decode8(encodedPixelData, size, samplesPerPixel);

        return decodedPixelData;
    }
    if (bitsAllocated === 16) {
        return _decode16(encodedPixelData, size, samplesPerPixel, pixelRepresentation);
    }

    throw new Error('unsupported pixel format for RLE');
}

function _decode8(
    encodedPixelData: any,
    size: { rows: number; columns: number },
    samplesPerPixel: number,
) {
    const frameData = encodedPixelData;
    const frameSize = size.rows * size.columns;
    const outFrame = new ArrayBuffer(frameSize * samplesPerPixel);
    const header = new DataView(frameData.buffer, frameData.byteOffset);
    const data = new Int8Array(frameData.buffer, frameData.byteOffset);
    const out = new Int8Array(outFrame);

    let outIndex = 0;
    const numSegments = header.getInt32(0, true);

    for (let s = 0; s < numSegments; ++s) {
        outIndex = s;

        let inIndex = header.getInt32((s + 1) * 4, true);
        let maxIndex = header.getInt32((s + 2) * 4, true);

        if (maxIndex === 0) {
            maxIndex = frameData.length;
        }

        const endOfSegment = frameSize * numSegments;

        while (inIndex < maxIndex) {
            const n = data[inIndex++];

            if (n >= 0 && n <= 127) {
                // copy n bytes
                for (let i = 0; i < n + 1 && outIndex < endOfSegment; ++i) {
                    out[outIndex] = data[inIndex++];
                    outIndex += samplesPerPixel;
                }
            } else if (n <= -1 && n >= -127) {
                const value = data[inIndex++];
                // run of n bytes
                for (let j = 0; j < -n + 1 && outIndex < endOfSegment; ++j) {
                    out[outIndex] = value;
                    outIndex += samplesPerPixel;
                }
            } /* else if (n === -128) { } // do nothing */
        }
    }
    const decodedPixelData = new Uint8Array(outFrame);

    return decodedPixelData;
}

function _decode8Planar(
    encodedPixelData: any,
    size: { rows: number; columns: number },
    samplesPerPixel: number,
) {
    const frameData = encodedPixelData;
    const frameSize = size.rows * size.columns;
    const outFrame = new ArrayBuffer(frameSize * samplesPerPixel);
    const header = new DataView(frameData.buffer, frameData.byteOffset);
    const data = new Int8Array(frameData.buffer, frameData.byteOffset);
    const out = new Int8Array(outFrame);

    let outIndex = 0;
    const numSegments = header.getInt32(0, true);

    for (let s = 0; s < numSegments; ++s) {
        outIndex = s * frameSize;

        let inIndex = header.getInt32((s + 1) * 4, true);
        let maxIndex = header.getInt32((s + 2) * 4, true);

        if (maxIndex === 0) {
            maxIndex = frameData.length;
        }

        const endOfSegment = frameSize * numSegments;

        while (inIndex < maxIndex) {
            const n = data[inIndex++];

            if (n >= 0 && n <= 127) {
                // copy n bytes
                for (let i = 0; i < n + 1 && outIndex < endOfSegment; ++i) {
                    out[outIndex] = data[inIndex++];
                    outIndex++;
                }
            } else if (n <= -1 && n >= -127) {
                const value = data[inIndex++];
                // run of n bytes
                for (let j = 0; j < -n + 1 && outIndex < endOfSegment; ++j) {
                    out[outIndex] = value;
                    outIndex++;
                }
            } /* else if (n === -128) { } // do nothing */
        }
    }

    const decodedPixelData = new Uint8Array(outFrame);

    return decodedPixelData;
}

function _decode16(
    encodedPixelData: { buffer: any; byteOffset: any; length: any },
    size: { rows: any; columns: any },
    samplesPerPixel: number,
    pixelRepresentation: number,
) {
    const frameData = encodedPixelData;
    const frameSize = size.rows * size.columns;
    const outFrame = new ArrayBuffer(frameSize * samplesPerPixel * 2);
    const header = new DataView(frameData.buffer, frameData.byteOffset);
    const data = new Int8Array(frameData.buffer, frameData.byteOffset);
    const out = new Int8Array(outFrame);

    const numSegments = header.getInt32(0, true);

    for (let s = 0; s < numSegments; ++s) {
        let outIndex = 0;
        const highByte = s === 0 ? 1 : 0;

        let inIndex = header.getInt32((s + 1) * 4, true);
        let maxIndex = header.getInt32((s + 2) * 4, true);

        if (maxIndex === 0) {
            maxIndex = frameData.length;
        }

        while (inIndex < maxIndex) {
            const n = data[inIndex++];

            if (n >= 0 && n <= 127) {
                for (let i = 0; i < n + 1 && outIndex < frameSize; ++i) {
                    out[outIndex * 2 + highByte] = data[inIndex++];
                    outIndex++;
                }
            } else if (n <= -1 && n >= -127) {
                const value = data[inIndex++];

                for (let j = 0; j < -n + 1 && outIndex < frameSize; ++j) {
                    out[outIndex * 2 + highByte] = value;
                    outIndex++;
                }
            } /* else if (n === -128) { } // do nothing */
        }
    }
    const decodedPixelData =
        pixelRepresentation === 0 ? new Uint16Array(outFrame) : new Int16Array(outFrame);

    return decodedPixelData;
}

export default decodeRle;
