# dicom-decoder-ring

## Transfer Syntaxes

A DICOM file's [Transfer Syntax UID (0002,0010)][transfer-syntax-uid] helps us identify how it's [Pixel Data (7FE0,0010)][pixel-data] is encoded. It, along with a few other choice fields, help us identify how to decode the image and access it's raw pixel data.

This library aims to support decoding the following DICOM standard representations

| Transfer Syntax        | Name                                                        | Codec                |
| ---------------------- | ----------------------------------------------------------- | -------------------- |
| _Uncompressed_         |                                                             |                      |
| 1.2.840.10008.1.2      | Implicit VR Endian (Default transfer syntax for DICOM)      | N/A                  |
| 1.2.840.10008.1.2.1    | Explicit VR Little Endian                                   | N/A                  |
| 1.2.840.10008.1.2.1.99 | Deflated Explicit VR Little Endian                          | N/A                  |
| 1.2.840.10008.1.2.2    | Explicit VR Big Endian                                      | N/A                  |
| _Compressed_           |                                                             |                      |
| 1.2.840.10008.1.2.4.50 | JPEG Baseline (Process 1 - 8 bit)                           | [jpeg-js][jpeg-js]   |
| 1.2.840.10008.1.2.4.51 | JPEG Baseline (Processes 2 & 4 - 12 bit)                    | [jpeg-js][jpeg-js]   |
| 1.2.840.10008.1.2.4.57 | JPEG Lossless, Nonhierarchical (Processes 14)               | Jpeg Lossless        |
| 1.2.840.10008.1.2.4.70 | JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1]) | Jpeg Lossless        |
| 1.2.840.10008.1.2.4.80 | JPEG-LS Lossless Image Compression                          | [CharLS][charls]     |
| 1.2.840.10008.1.2.4.81 | JPEG-LS Lossy (Near-Lossless) Image Compression             | [CharLS][charls]     |
| 1.2.840.10008.1.2.4.90 | JPEG 2000 Image Compression (Lossless Only)                 | [OpenJPEG][openjpeg] |
| 1.2.840.10008.1.2.4.91 | JPEG 2000 Image Compression                                 | [OpenJPEG][openjpeg] |
| 1.2.840.10008.1.2.4.92 | JPEG 2000 Part 2 Multicomponent (Lossless Only)             | [OpenJPEG][openjpeg] |
| 1.2.840.10008.1.2.4.93 | JPEG 2000 Part 2 Multicomponent (Lossy)                     | [OpenJPEG][openjpeg] |
| 1.2.840.10008.1.2.5    | RLE Lossless                                                | RLE                  |

Note: The standard includes additional transfer syntaxes, some of which are retired. You can find a [full list here][transfer-syntax-list]. The OpenJPEG codec may also be able to decode retired syntaxes `*.4.92` and `*.4.93`.

### Codecs

| Name               | Description                                | License            | Source            |
| ------------------ | ------------------------------------------ | ------------------ | ----------------- |
| [jpeg-js][jpeg-js] | Pure javascript JPEG encoder and decoder\* | Apache 2.0 / Adobe | [GitHub][jpeg-js] |

\* - Faster, non-blocking, alternatives exist if you have access to the DOM ([canvas API][canvas-api]) or are using node ([sharp][sharp]). We use `jpeg-js` because it works in a Web Worker.

## Photometric Interpretations

-   MONOCHROME1
-   MONOCHROME2
-   RGB (pixel and planar configurations)
-   PALETTE COLOR
-   YBR_FULL
-   YBR_FULL_422
-   YBR_RCT
-   YBR_ICT

## Resources

-   [Webpack: TypeScript](https://webpack.js.org/guides/typescript/)
    -   [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
    -   [Using third party libraries](https://webpack.js.org/guides/typescript/#using-third-party-libraries)

<!-- prettier-ignore-start -->

<!--
    LINKS
-->

[transfer-syntax-uid]: http://dicom.nema.org/dicom/2013/output/chtml/part10/chapter_7.html
[pixel-data]: http://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.6.3.html#sect_C.7.6.3.1.4
[charls]: https://github.com/team-charls/charls
[openjpeg]: https://github.com/uclouvain/openjpeg
[jpeg-js]: https://github.com/eugeneware/jpeg-js
[canvas-api]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[sharp]: https://www.npmjs.com/package/sharp
[transfer-syntax-list]: https://www.dicomlibrary.com/dicom/transfer-syntax/
