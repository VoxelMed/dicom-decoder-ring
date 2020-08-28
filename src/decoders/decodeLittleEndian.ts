function decodeLittleEndian(
    encodedPixelData: Uint8Array,
    bitsAllocated: number,
    pixelRepresentation: number,
) {
    let arrayBuffer = encodedPixelData.buffer;
    let offset = encodedPixelData.byteOffset;
    const length = encodedPixelData.length;

    if (bitsAllocated === 8 || bitsAllocated === 1) {
        return encodedPixelData;
    }

    if (bitsAllocated === 16) {
        // if pixel data is not aligned on even boundary, shift it so we can create the 16 bit array
        // buffers on it
        if (offset % 2) {
            arrayBuffer = arrayBuffer.slice(offset);
            offset = 0;
        }

        const decodedPixelData =
            pixelRepresentation === 0
                ? new Uint16Array(arrayBuffer, offset, length / 2)
                : new Int16Array(arrayBuffer, offset, length / 2);

        return decodedPixelData;
    }

    if (bitsAllocated === 32) {
        // if pixel data is not aligned on even boundary, shift it
        if (offset % 2) {
            arrayBuffer = arrayBuffer.slice(offset);
            offset = 0;
        }

        const decodedPixelData = new Float32Array(arrayBuffer, offset, length / 4);

        return decodedPixelData;
    }
}

export default decodeLittleEndian;
