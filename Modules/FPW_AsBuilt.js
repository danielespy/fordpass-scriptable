module.exports = class FPW_AsBuilt {
    nodeDesc = {
        F10A: 'ECU_CONFIGURATION',
        F110: 'PART_II_SPECIFICATION (ASSEMBLY)',
        F111: 'CORE_ASSEMBLY_PART',
        F113: 'ASSEMBLY',
        F124: 'CALIBRATION',
        F129: 'OTHER',
        F12B: 'OTHER',
        F12C: 'OTHER',
        F142: 'SERIAL_NUMBER',
        F143: 'SERIAL_NUMBER',
        F144: 'SERIAL_NUMBER',
        F16B: 'ECU_CONFIGURATION',
        F17F: 'SERIAL_NUMBER',
        F188: 'STRATEGY (SW VERSION)',
        F18C: 'SERIAL_NUMBER',
        F190: 'VIN',
    };

    constructor(FPW) {
        this.FPW = FPW;
        this.SCRIPT_ID = FPW.SCRIPT_ID;
        this.widgetConfig = FPW.widgetConfig;
        this.tableMap = {};
    }

    moduleInfo(addr) {
        const info = {
            760: { desc: 'ABS - Anti-Lock Brake System', updatable: true },
            '7C7': { desc: 'ACCM - Air Conditioning Control Module', updatable: false },
            727: { desc: 'ACM - Audio Front Control Module', updatable: true },
            '7D0': { desc: 'APIM - Accessory Protocol Interface Module (SYNC)', updatable: true },
            792: { desc: 'ATCM - All Terrain Control Module', updatable: true },
            726: { desc: 'BCM - Body Control Module', updatable: true },
            '6F0': { desc: 'BCMC [BJB] - Body Control Module C [battery junction box]', updatable: true },
            '7E4': { desc: 'BECM - Battery Energy Control Module', updatable: false },
            764: { desc: 'CCM - Cruise Control Module', updatable: true },
            '7C1': { desc: 'CMR - Camera Module Rear [Driver Status Monitor Camera Module]', updatable: true },
            '6F1': { desc: 'DCACA - Direct Current/Alternating Current Converter Module A', updatable: true },
            746: { desc: 'DCDC - Direct Current/Direct Current Converter Module', updatable: false },
            740: { desc: 'DDM - Driver Door Module', updatable: true },
            744: { desc: 'DSM / RBM - Driver Front Seat Module / Running Board Control Module', updatable: true },
            783: { desc: 'DSP - Audio Digital Signal Processing Module', updatable: true },
            732: { desc: 'GSM - Gear Shift Module', updatable: false },
            716: { desc: 'GWM - Gateway Module A', updatable: true },
            734: { desc: 'HCM - Headlamp Control Module', updatable: true },
            733: { desc: 'HVAC - Heating, Ventillation and Air Conditioning Module', updatable: true },
            720: { desc: 'IPC - Instrument Panel Cluster', updatable: true },
            706: { desc: 'IPMA - Image Processing Module A', updatable: true },
            765: { desc: 'OCS - Occupant Classification System', updatable: false },
            750: { desc: 'PACM - Pedestrian Alert Control Module', updatable: false },
            741: { desc: 'PDM - Passenger Door Module', updatable: true },
            730: { desc: 'PSCM - Power Steering Control Module', updatable: true },
            737: { desc: 'RCM - Restraints Control Module', updatable: true },
            775: { desc: 'RGTM - Rear Gate Trunk Module', updatable: false },
            751: { desc: 'RTM - Radio Transceiver Module', updatable: true },
            797: { desc: 'SASM - Steering Angle Sensor Module', updatable: true },
            724: { desc: 'SCCM - Steering Column Control Module', updatable: true },
            712: { desc: 'SCMG - Driver Multi-Contour Seat Module', updatable: true },
            713: { desc: 'SCMH - Passenger Multi-Contour Seat Module', updatable: true },
            '7C5': { desc: 'SECM - Steering Effort Control Module', updatable: true },
            '7E6': { desc: 'SOBDMC - Secondary On-Board Diagnostic Control Module C', updatable: true },
            '6F2': { desc: 'SODCMC - Side Obstacle Detection Control Module C', updatable: true },
            '6F3': { desc: 'SODCMD -  Side Obstacle Detection Control Module D', updatable: true },
            '7C4': { desc: 'SODL -  Side Obstacle Detection Control Module LH', updatable: true },
            '7C6': { desc: 'SODR -  Side Obstacle Detection Control Module RH', updatable: true },
            761: { desc: 'TCCM - Transfer Case Control Module', updatable: false },
            '7E9': { desc: 'TCM - Transmission Control Module', updatable: true },
            754: { desc: 'TCU - Telematic Control Unit Module', updatable: true },
            791: { desc: 'TRM / TBM - Trailer Module / Trailer Brake Control Module', updatable: true },
            721: { desc: 'VDM - Vehicle Dynamics Control Module', updatable: true },
            725: { desc: 'WACM - Wireless Accessory Charging Module', updatable: true },
            '7E0': { desc: 'PCM - Powertrain Control Module', updatable: true },
        };
        if (addr === '7E0') {
            return { desc: 'PCM - Powertrain Control Module', updatable: true };
        } else {
            return info[isNaN(addr) ? addr.toString() : parseInt(addr)] || { desc: 'Unknown Module', updatable: false };
        }
    }

    async getAsBuiltFile(vin, cnt = 0) {
        const wv = new WebView();
        if (cnt > 3) {
            return;
        }
        await wv.loadURL('https://www.motorcraftservice.com/asbuilt');
        // await wv.loadRequest(request);
        let html = await wv.getHTML();

        if (html.includes('<div><b>Please select Country</b></div>')) {
            console.log('needs country');
            const data = await wv.evaluateJavaScript(`
            function setHomeCountry() {
                let tokenElem = document.querySelector("input[name='__RequestVerificationToken']")
                const token = tokenElem.value.toString();
                console.log('token: ' + token);
                document.querySelector('#selectedCountry').value = 153;
                console.log(document.querySelector('#selectedCountry').value);
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true); // onchange event
                document.querySelector('#selectedCountry').dispatchEvent(event);
                document.querySelector('#selectedLanguage').value = 'EN-US';
                console.log(document.querySelector('#selectedLanguage').value);
                document.forms[0].submit();   
            }
             setHomeCountry()
        `);
            await wv.waitForLoad();
            // wv.present();
        }

        // console.log(html);
        let imgData = await wv.evaluateJavaScript(`
            function getBase64Image(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                return dataURL.split(';base64,')[1];
            }
            getBase64Image(document.getElementById("CaptchaImage"));
        `);

        // await wv.waitForLoad();
        // console.log(`imageData: ${imgData}`);
        if (imgData && imgData.length > 0) {
            console.log('imageData: ' + imgData.length);
            let id = Data.fromBase64String(imgData);
            // console.log(id);
            let captchaImg = await Image.fromData(id);
            // console.log(captchaImg);
            if (captchaImg) {
                // captchaImg.saveAs(`${vin}.gif`);
                await this.FPW.App.createCaptchaPage(captchaImg);
                const code = await this.FPW.Alerts.showCaptchaPrompt();
                console.log(`Captcha code: ${code}`);
                if (code) {
                    this.FPW.Alerts.showAlert('Please wait...', 'This process can take many seconds to complete.  You will receive another prompt when the data is downloaded and saved.');
                    let js3 = await wv.evaluateJavaScript(`
                        function setVinAndCaptcha() {
                            let tokenElem = document.querySelector("input[name='__RequestVerificationToken']")
                            const token = tokenElem.value.toString();
                            console.log('token: ' + token);
                            document.querySelector('#VIN').value = '${vin}';
                            console.log(document.querySelector('#VIN').value);
                            document.querySelector('#CaptchaInputText').value = '${code}';
                            console.log(document.querySelector('#CaptchaInputText').value);
                            document.forms[0].submit();
                        }
                         setVinAndCaptcha();
                    `);
                    await wv.waitForLoad();
                    let html2 = await wv.getHTML();
                    // console.log(html2);
                    if (html2.includes('/AsBuilt/Download') && html2.includes('asbuiltJson')) {
                        console.log('found download page');
                        let js4 = await wv.evaluateJavaScript(`
                            function getAsbuilt() {
                                // let tokenElem = document.querySelector("input[name='__RequestVerificationToken']")
                                // const token = tokenElem.value.toString();
                                // console.log('token_download: ' + token);

                                let asbJsonElem = document.querySelector("input[name='asbuiltJson']")
                                const asbJson = asbJsonElem.value.toString();
                                console.log('asbJson: ' + asbJson.length);
                                // document.forms[0].submit();
                                return asbJson.toString();
                                
                            }
                            getAsbuilt();
                        `);
                        // console.log(js4);
                        if (js4 && js4.length > 0) {
                            await this.FPW.Files.saveJsonFile('AsBuilt Data', JSON.parse(js4.toString()), `${vin}`, true);
                            this.FPW.Alerts.showAlert('AsBuilt Data', `AsBuilt data for ${vin} has been saved.`);
                        }
                    }
                }
            }
        }
        // await wv.present();
    }
};