
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Base64 } from './base64';

describe('CallBackService', () => {
    const textDecodedMock = 'Test';
    const textEncodedMock = 'VGVzdA==';
    const bytesToBlobMock = [new Uint8Array([84, 101, 115, 116])];
    const bytesToArrayBufferMock = new Uint8Array([84, 101, 115, 116]);


    const csvDataMock = 'InVzZXJJZCIsInVzZXJOYW1lIiwid29ya0VtYWlsIiwidXNlckRldGFpbF9maXJzdE5hbWUiLCJ1c2VyRGV0YWlsX2xhc3ROYW1lIiwidXNlckRldGFpbF9tTGFzdE5hbWUiLCJlbmFibGVkIiwiZ3JvdXBfbmFtZSINCiJTSSINCiJTSSINCiJTSSINCiJTSSINCiJTSSINCg==';
    const xlsDataMock = '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8ejunAIAAJwCAAALAAAAX3JlbHMvLnJlbHPvu788P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJ1dGYtOCI/PjxSZWxhdGlvbnNoaXBzIHhtbG5zPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMiPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9vZmZpY2VEb2N1bWVudCIgVGFyZ2V0PSIveGwvd29ya2Jvb2sueG1sIiBJZD0iUjYzYTdjYTNhMTBlYjRiOWQiIC8+PFJlbGF0aW9uc2hpcCBUeXBlPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL2V4dGVuZGVkLXByb3BlcnRpZXMiIFRhcmdldD0iL2RvY1Byb3BzL2FwcC54bWwiIElkPSJySWQxIiAvPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzL21ldGFkYXRhL2NvcmUtcHJvcGVydGllcyIgVGFyZ2V0PSIvcGFja2FnZS9zZXJ2aWNlcy9tZXRhZGF0YS9jb3JlLXByb3BlcnRpZXMvMGJmMDM0OTdhOWVjNGY0Yzk0NzJlZjhhYzdlZDVlNGUucHNtZGNwIiBJZD0iUjc2ZmFmYTFhODI3MDQzZTEiIC8+PC9SZWxhdGlvbnNoaXBzPlBLAwQUAAAICADBTm5UDNxIs+MAAAC+AgAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxztZJBTsMwEEWvYs2eTFpQhVDdbrrptvQCljOJoya25ZnS9mwsOBJXwAQJYcSCTTa2/Mfz9Mby++vbensdB/VCifvgNSyqGhR5G5redxrO0t49wnazPtBgJN9g10dWucWzBicSnxDZOhoNVyGSz5U2pNFIPqYOo7En0xEu63qF6ScDSqY63iL9hxjatre0C/Y8kpc/wMjOJGqeJeUJGNTRpI5EA16HslRlMqh9oyHtm3tQOJ+R3Ab6rTJlhcPDnA6XkE7siKTU+I4/3y1vi8JoOaeR5F4qbaboay1FVpMIFr9w8wFQSwMEFAAACAgAwU5uVFo7UkA8AQAANwQAABMAAABbQ29udGVudF9UeXBlc10ueG1srZRNTsMwEIWvEnmLYrcsEEJNuwC2UAkuYNmTxKr/5JmW9mwsOBJXYJqiglBFBe3GljMz73se23l/fZvM1sFXKyjoUmzEWI5EBdEk62LXiCW19bWYTSfPmwxYcWrERvRE+UYpND0EjTJliBxpUwmaeFk6lbVZ6A7U5Wh0pUyKBJFq2mqI6eQOWr30VN2v+fMOy+Wiut3lbVGN0Dl7ZzRxWK2i/QGpU9s6AzaZZeASibmAttgDUPBymGXQLl4MwuogM2OwJv8N+7kvaVKBOheOFnKAv2EKePwfhCuHHOxd/kI88lkVZ6Ga60IPOrCe4j7M2QwqVpan9hK23i3YQ/s7BF97hb0uYJ+o8KVBee7D/KZ91AhtPJzdwSB6DP2SymKoQG4HT+Mzu9jrHzNC/CphN57uYZDZE9XwG5h+AFBLAQIUABQAAAgIAMFOblT5Vy4RAgEAALoBAAAPAAAAAAAAAAAAAAAAAAAAAAB4bC93b3JrYm9vay54bWxQSwECFAAUAAAICADBTm5UIr2HWGIBAAA6AwAAEAAAAAAAAAAAAAAAAAAvAQAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUABQAAAgIAMFOblT3CAwJ1AAAANMBAAAUAAAAAAAAAAAAAAAAAL8CAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQIUABQAAAgIAMFOblQQerFJbQIAANgIAAANAAAAAAAAAAAAAAAAAMUDAAB4bC9zdHlsZXMueG1sUEsBAhQAFAAACAgAwU5uVColhwLBAgAAWAgAABgAAAAAAAAAAAAAAAAAXQYAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQIUABQAAAgIAMFOblR1sZFetwUAALsbAAATAAAAAAAAAAAAAAAAAFQJAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAhQAFAAACAAAwU5uVHErqWPaAQAA2gEAAFEAAAAAAAAAAAAAAAAAPA8AAHBhY2thZ2Uvc2VydmljZXMvbWV0YWRhdGEvY29yZS1wcm9wZXJ0aWVzLzBiZjAzNDk3YTllYzRmNGM5NDcyZWY4YWM3ZWQ1ZTRlLnBzbWRjcFBLAQIUABQAAAgAAMFOblTM8ejunAIAAJwCAAALAAAAAAAAAAAAAAAAAIURAABfcmVscy8ucmVsc1BLAQIUABQAAAgIAMFOblQM3Eiz4wAAAL4CAAAaAAAAAAAAAAAAAAAAAEoUAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQIUABQAAAgIAMFOblRaO1JAPAEAADcEAAATAAAAAAAAAAAAAAAAAGUVAABbQ29udGVudF9UeXBlc10ueG1sUEsFBgAAAAAKAAoAwAIAANIWAAAAAA==';
    const pdfDataMock = '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Y1SjW4TLK8Csk8xWfr5tgFyFL3xtFuIyVvexSBIMs4Fd8V4nyT3hZJD/BhXb0PQA8KXxrSHzHGIVBz7eMFAuAI700T0EyiOyxQ9LrFzYujhS8PmrjmpjHLQmRf6K88CaNTPl5BrA8nt7wsmS6QHgbUaNwETxpWELsBPCg37Z8M6KAwxDBGSuZxJc+t1BPvMZj5dIDo4RrByd8lH+9jyXtwrIemh6t8GtIiKZ3j90FgsJkk4E7iTP40EWmEPtRYlK7CyRk21q5gY0t2FECSalZ510gmQ9CcOwMlvU3hvImNH50s4U2NNe0GWIfzBJ8AIDL1xlih/4y0GcaCaTXGxZqaSsg5Atn3EiXD1FL8PaEJcS2cVRy8QhDMaY3dJvmnQ26TLXJ1L1tiJApxE5Nak+0IPElW9yfpBB6Qo/JLqzWFp8sSpTfElwgZnHvcN6Cxo88GEqLNT4ngctKbTKlnG8Z4UHf6QJJ7orwTVeCfmIb6X89RMj10VUqkaQJvPRSXsinIpp8+ibFW7+HQxV7MHhSCOar6OV9Fd6tmLeM0umcQ6YQO0nEEvJaE1zEZGvgMNfXiKlEklYlvPwkGepCOkbGqGS8tP3TYtUmU6cC/FDJssv1dlDDHVtiutFr63UAC/aEluinVomwellWfzZN4mNd1lyzbCfvLtBB30UmgZFNK3nEyzYJ8oxVR7tAopYQ5SOsx257eCC+To+6eQnU7gePJsJ9nAVMLHC6QBJi5z+W1cC5sZJtEuQZq1QimdbCy0+ivHDkzZjyES9t/9ToWtwGPHk7gw9doIO+a5fr/Q41/J3w5XICElWrWcl5vpDTEvuJWvwZhirPL/MjmOWC8mneY6U2GeQC3Sk3KeCSt+cjFYz38fbw6jEv22jkSItJJfqpRVoQUkqzvWVkfJoVDUMTW1oXQbaDvp+vSUCy2G3ptiF24KiqD9Iws59a5Kwm+PtsaiQBI9+vDtuqURh5q9nNApHpoF8lK8X6PwR2EGfi2gurmXMDtUQ/tShrB8s6ls0F6sOYI80F0zOdvAFgVqZzlyMZDdaoOfULgm0Adky/yGSoVKKfWoQl/M83knLgwJIO81SWfL7oXlCLAbpA58m7i1Kmg/6lRQT7SpnAZOnrHITq9PSiN1KJfmoRlpCCn7KexWgsWHB1Ajii0ZqNGqGm7QuZGeJLFSjMv9o2trGN/xT+DbQBJpEKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgOQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDEwNTUgMDAwMDAgbiAKMDAwMDAwMTM1MCAwMDAwMCBuIAowMDAwMDAxMTAwIDAwMDAwIG4gCjAwMDAwMDA5MDAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAxMjYyIDAwMDAwIG4gCjAwMDAwMDE0MDEgMDAwMDAgbiAKMDAwMDAwNzA3NyAwMDAwMCBuIAp0cmFpbGVyCjw8L0lEIFs8NWQ5Yjg3NGJiOGRiYTEwNDdkZjhlYTFmZWVjMmE1MTA+PDVkOWI4NzRiYjhkYmExMDQ3ZGY4ZWExZmVlYzJhNTEwPl0vSW5mbyAzIDAgUi9Sb290IDEgMCBSL1NpemUgOT4+CiVpVGV4dC1Db3JlLTcuMi4xCnN0YXJ0eHJlZgoxMDE5MwolJUVPRgo=';

    let thisObj = new Base64();

    beforeEach(async () => {
        await TestBed
            .configureTestingModule({
                // teardown: { destroyAfterEach: false },
                imports: [
                ],

                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            })
            .compileComponents();
        thisObj = new Base64();
    });

    it('DecodeUnicode', () => {
        expect(thisObj.DecodeUnicode(textEncodedMock)).toEqual(textDecodedMock);
    });

    it('Base64toBlob', () => {
        expect(thisObj.Base64toBlob(textEncodedMock)).toEqual(bytesToBlobMock);
    });

    it('base64ToArrayBuffer', () => {
        expect(thisObj.base64ToArrayBuffer(textEncodedMock)).toEqual(bytesToArrayBufferMock);
    });

    it('toFile CSV', () => {
        const fileName = 'test';
        const fileType = 'csv';
        // let b64 = new Base64();
        // let properties: any = { type: 'text/csv;charset=utf-8;' };
        // let _byteArray: any[] = [b64.DecodeUnicode(csvDataMock)];
        // let dataBlob: Blob = new Blob(_byteArray, properties);


        spyOn(Base64, 'toFile').withArgs(csvDataMock, 'csv', 'test').and.callThrough();
        // let link: HTMLAnchorElement = document.createElement('a');
        // spyOn(link, 'click');
        // const url = window.URL.createObjectURL(dataBlob);
        // link.href = url;
        // link.setAttribute('download', fileName + '.' + fileType);
        // document.body.appendChild(link);
        // link.click();
        // expect(link.href).toEqual(url);
        // expect(link.download).toEqual(fileName + '.' + fileType);
        // expect(link.click).toHaveBeenCalled();
        // document.body.removeChild(link);
        // expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);
        Base64.toFile(csvDataMock, 'csv', 'test');
        expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);
    });

    it('toFile XLS', () => {
        const fileName = 'test';
        const fileType = 'xls';
        // let b64 = new Base64();
        // let properties: any = { type: 'application/vnd.ms-excel;base64, bindata' };
        // let _byteArray: any[] = b64.Base64toBlob(xlsDataMock);
        // let dataBlob: Blob = new Blob(_byteArray, properties);


        spyOn(Base64, 'toFile').withArgs(xlsDataMock, 'xls', 'test').and.callThrough();


        // let link: HTMLAnchorElement = document.createElement('a');
        // spyOn(link, 'click').and.callThrough();

        // const url = window.URL.createObjectURL(dataBlob);
        // link.href = url;
        // expect(link.href).toEqual(url);

        // link.setAttribute('download', fileName + '.' + fileType);
        // expect(link.download).toEqual(fileName + '.' + fileType);


        // document.body.appendChild(link);
        // link.click();
        // expect(link.click).toHaveBeenCalled();


        // document.body.removeChild(link);
        // expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);
        Base64.toFile(xlsDataMock, 'xls', 'test');
        expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);
    });

    it('toFile PDF', () => {
        const fileName = 'test';
        const fileType = 'pdf';
        // let b64 = new Base64();
        // let properties: any = { type: 'application/pdf;base64, bindata' };
        // let _byteArray: any[] = [b64.base64ToArrayBuffer(pdfDataMock)];
        // let dataBlob: Blob = new Blob(_byteArray, properties);


        spyOn(Base64, 'toFile').withArgs(pdfDataMock, 'pdf', 'test').and.callThrough();


        // let link: HTMLAnchorElement = document.createElement('a');
        // spyOn(link, 'click').and.callThrough();

        // const url = window.URL.createObjectURL(dataBlob);
        // link.href = url;
        // expect(link.href).toEqual(url);

        // link.setAttribute('download', fileName + '.' + fileType);
        // expect(link.download).toEqual(fileName + '.' + fileType);


        // document.body.appendChild(link);
        // link.click();
        // expect(link.click).toHaveBeenCalled();


        // document.body.removeChild(link);
        // expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);
        Base64.toFile(pdfDataMock, 'pdf', 'test');
        expect(document.body.getElementsByTagName('a')[1]).not.toBeDefined(fileName + '.' + fileType);

    });
});