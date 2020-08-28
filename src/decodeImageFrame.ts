import TRANSFER_SYNTAX from './TRANSFER_SYNTAX';
import decodeBigEndian from './decoders/decodeBigEndian';
import decodeJpegBaseline from './decoders/decodeJpegBaseline';
import decodeLittleEndian from './decoders/decodeLittleEndian';
import decodeRle from './decoders/decodeRle';
import decodeJpegLossless from './decoders/decodeJpegLossless';

export default function getImageFrame(
    encodedPixelData: Uint8Array,
    transferSyntax: string,
    imageFrame: {
        bitsAllocated: number;
        bitsStored: number;
        pixelRepresentation: number;
        planarConfiguration: number;
        samplesPerPixel: number;
        size: { rows: number; columns: number };
    },
    decodeConfig,
    options,
) {
    let decodedPixelData: Uint8Array | Uint16Array | Int16Array | Float32Array;
    const {
        bitsAllocated,
        bitsStored,
        pixelRepresentation,
        planarConfiguration,
        samplesPerPixel,
        size,
    } = imageFrame;

    switch (transferSyntax) {
        case TRANSFER_SYNTAX.Implicit_VR_Endian:
        case TRANSFER_SYNTAX.Explicit_VR_Little_Endian:
        case TRANSFER_SYNTAX.Deflated_Explicit_VR_Little_Endian:
            decodedPixelData = decodeLittleEndian(
                encodedPixelData,
                bitsAllocated,
                pixelRepresentation,
            );
            break;
        case TRANSFER_SYNTAX.Explicit_VR_Big_Endian:
            decodedPixelData = decodeBigEndian(
                encodedPixelData,
                bitsAllocated,
                pixelRepresentation,
            );
            break;
        case TRANSFER_SYNTAX.RLE_Lossless:
            decodedPixelData = decodeRle(
                encodedPixelData,
                bitsAllocated,
                planarConfiguration,
                size,
                samplesPerPixel,
                pixelRepresentation,
            );
            break;
        case TRANSFER_SYNTAX.JPEG_Baseline__Process_1_8_bit:
        case TRANSFER_SYNTAX.JPEG_Baseline__Processes_2n4_12_bit:
            decodedPixelData = decodeJpegBaseline(encodedPixelData, bitsAllocated);
            break;
        case TRANSFER_SYNTAX.JPEG_Lossless_Nonhierarchical__Processes_14:
        case TRANSFER_SYNTAX.JPEG_Lossless_Nonhierarchical__Processes_14__Selection_1:
            decodedPixelData = decodeJpegLossless(
                encodedPixelData,
                bitsAllocated,
                pixelRepresentation,
            );
            break;
        case TRANSFER_SYNTAX.JPEG_LS_Lossless:
        case TRANSFER_SYNTAX.JPEG_LS_Lossy:
            // decodeJpegLs
            break;
        case TRANSFER_SYNTAX.JPEG_2000_Lossless:
        case TRANSFER_SYNTAX.JPEG_2000_Lossy:
        case TRANSFER_SYNTAX.JPEG_2000_Part_2_Mulitcomponent_Lossless:
        case TRANSFER_SYNTAX.JPEG_2000_Part_2_Mulitcomponent_Lossy:
            // decodeJpeg2000
            break;
        default:
        // throw?
    }

    const shouldShift = pixelRepresentation === 1 && !isNaN(bitsStored);
    if (shouldShift) {
        const shift = 32 - bitsStored;
        for (let i = 0; i < decodedPixelData.length; i++) {
            // eslint-disable-next-line no-bitwise
            decodedPixelData[i] = (decodedPixelData[i] << shift) >> shift;
        }
    }
}
