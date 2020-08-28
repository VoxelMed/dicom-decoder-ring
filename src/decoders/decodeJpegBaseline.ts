// https://github.com/eugeneware/jpeg-js
// https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/master/codecs/jpeg.js
import { decode } from 'jpeg-js';

// Note: we may need to fork `jpeg-js` to use the internal API
// it looks like recent authors have tried to simplify usage
// wado-loader: https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/master/src/shared/decoders/decodeJPEGBaseline.js
// jpeg-js: https://github.com/eugeneware/jpeg-js/blob/master/lib/decoder.js#L1091
function decodeJpegBaseline(encodedPixelData: Uint8Array, bitsAllocated: number) {
    // { width, height, data }
    const decodedInfo = decode(encodedPixelData, {
        // Do not use the internal color transform
        // We will handle this afterwards
        colorTransform: false,
        // false - "data" in return object is ArrayBuffer
        // true - "data" in return object is a Uint8Array
        useTArray: true,
    });

    if (bitsAllocated === 8) {
        return decodedInfo.data;
    }
    if (bitsAllocated === 16) {
        // throw not implemented exception
        // jpeg.getData16(size.columns, size.rows);
    }
}

export default decodeJpegBaseline;
