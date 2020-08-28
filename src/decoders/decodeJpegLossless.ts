import { jpeg } from 'jpeg-lossless-decoder-js';

function decodeJpegLossless(
    encodedPixelData: Uint8Array,
    bitsAllocated: number,
    pixelRepresentation: number,
) {
    const byteOutput = bitsAllocated <= 8 ? 1 : 2;
    const buffer = encodedPixelData.buffer;
    const decoder = new jpeg.lossless.Decoder();
    const decompressedData = decoder.decode(
        buffer,
        encodedPixelData.byteOffset,
        encodedPixelData.length,
        byteOutput,
    );

    let decodedPixelData: Uint8Array | Uint16Array | Int16Array;

    if (pixelRepresentation === 0 && bitsAllocated === 16) {
        decodedPixelData = new Uint16Array(decompressedData.buffer);
    }
    // untested!
    else if (pixelRepresentation === 0) {
        decodedPixelData = new Uint8Array(decompressedData.buffer);
    } else {
        decodedPixelData = new Int16Array(decompressedData.buffer);
    }

    return decodedPixelData;
}

export default decodeJpegLossless;
