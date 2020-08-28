// TODO: Detect WASM versus JS support?
// https://github.com/VoxelMed/charls-js/blob/master/test/browser/index.html#L382
// This deviates a bit from previous decoder; may need to reconcile
import CharLS from '@voxelmed/charlsjs';

let _decoder: any;

// May need to await on `onRuntimeInitialized` CharLS first?
function decodeJpegLs(encodedPixelData: Uint8Array, pixelRepresentation: number) {
    if (!_decoder) {
        _decoder = new CharLS.JpegLSDecoder();
    }

    const encodedBuffer = _decoder.getEncodedBuffer(encodedPixelData.length);
    encodedBuffer.set(encodedPixelData);

    _decoder.decode();

    const uncompressedImageFrame = new Uint8Array(_decoder.getDecodedBuffer().length);
    uncompressedImageFrame.set(_decoder.getDecodedBuffer());

    const frameInfo = _decoder.getFrameInfo();
    const interleaveMode = _decoder.getInterleaveMode();
    const nearLossless = _decoder.getNearLossless();
    const decodedBuffer = _decoder.getDecodedBuffer();
    const { bitsPerSample } = frameInfo;
    const isSigned = pixelRepresentation === 1;

    const decodedPixelData = _getPixelData(decodedBuffer, bitsPerSample, isSigned);

    return decodedPixelData;

    // // throw error if not success or too much data
    // if (image.result !== 0 && image.result !== 6) {
    //     throw new Error(`JPEG-LS decoder failed to decode frame (error code ${image.result})`);
    // }

    // TODO: WHY WOULD THIS MODIFY ROWS/COLUMNS?!?!?!?!
    // imageFrame.columns = image.width;
    // imageFrame.rows = image.height;
    // imageFrame.pixelData = image.pixelData;
}

function _getPixelData(decodedBuffer: Buffer, bitsPerSample: number, isSigned: boolean) {
    if (bitsPerSample > 8) {
        if (isSigned) {
            return new Int16Array(
                decodedBuffer.buffer,
                decodedBuffer.byteOffset,
                decodedBuffer.byteLength / 2,
            );
        } else {
            return new Uint16Array(
                decodedBuffer.buffer,
                decodedBuffer.byteOffset,
                decodedBuffer.byteLength / 2,
            );
        }
    } else {
        // Not a typed array? Maybe Uint8 by default?
        return decodedBuffer;
    }
}

export default decodeJpegLs;
