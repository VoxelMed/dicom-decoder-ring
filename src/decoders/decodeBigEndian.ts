/**
 *
 * @param bitsAllocated
 * @param pixelRepresentation
 * @param encodedPixelData
 */
function decodeBigEndian(
    encodedPixelData: Uint8Array,
    bitsAllocated: number, // 8 || 16
    pixelRepresentation: number, // 0 || ?
) {
    if (bitsAllocated === 8) {
        return encodedPixelData;
    }

    if (bitsAllocated === 16) {
        let arrayBuffer = encodedPixelData.buffer;
        let offset = encodedPixelData.byteOffset;
        const length = encodedPixelData.length;

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

        // Do the byte swap
        for (let i = 0; i < decodedPixelData.length; i++) {
            decodedPixelData[i] = _swap16(decodedPixelData[i]);
        }

        return decodedPixelData;
    }
}

function _swap16(val: number) {
    return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
}

export default decodeBigEndian;
