export class Base64 {
 
    //Decodifica unicode. Utilizado para CSV's
    public DecodeUnicode(str: string): string {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        let response = decodeURIComponent(atob(str).split('').map(function (c) {

            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return response;

    };


    //Convierte base64 to Blob, utilizado para los XlSX
    public Base64toBlob(base64Data: string) {
        let sliceSize = 1024;
        let byteCharacters = atob(base64Data);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);

            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }

        return byteArrays;
    }

    // Convierte base64 to arrayBuffer. Utilizado para los PDF's
    public base64ToArrayBuffer(base64: string) {
        let binaryString: string = window.atob(base64);
        let binaryLen: number = binaryString.length;
        let bytes: any = new Uint8Array(binaryLen);
        for (let i: number = 0; i < binaryLen; i++) {
            let ascii: number = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }


        return bytes;
    }

    static toFile(_bytes: string, fileType: string, fileName: string) {


        let properties: any = null;
        let _byteArray: any[] = [];
        let b64 = new Base64();

        switch (fileType) {
            case 'csv': {
                properties = { type: 'text/csv;charset=utf-8;' };
                _byteArray = [b64.DecodeUnicode(_bytes)];
                break;
            }
            case 'xls':
            case 'xlsx': {
                properties = { type: 'application/vnd.ms-excel;base64, bindata' };
                _byteArray = b64.Base64toBlob(_bytes);
                break;
            }
            case 'pdf': {
                properties = { type: 'application/pdf;base64, bindata' };
                _byteArray = [b64.base64ToArrayBuffer(_bytes)];
                break;
            }
        }


        let dataBlob: Blob = new Blob(_byteArray, properties);

        //In FF link must be added to DOM to be clicked
        let link: HTMLAnchorElement = document.createElement('a');
        link.href = window.URL.createObjectURL(dataBlob);
        link.setAttribute('download', fileName + '.' + fileType);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}