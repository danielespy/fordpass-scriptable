const fm = FileManager.iCloud();
const FPW_WidgetHelpers = importModule(fm.joinPath(fm.documentsDirectory(), 'FPWModules') + '/FPW_Widgets_Helpers.js');

module.exports = class FPW_Widgets_ExtraLarge {
    constructor(FPW) {
        this.FPW = FPW;
        this.SCRIPT_ID = FPW.SCRIPT_ID;
        this.widgetConfig = FPW.widgetConfig;
        this.WidgetHelpers = new FPW_WidgetHelpers(FPW);
    }

    async createWidget(vData, style = undefined) {
        const wStyle = await this.FPW.getWidgetStyle();
        style = style || wStyle;
        switch (style) {
            case 'simple':
                return await this.simpleWidget(vData);
            case 'detailed':
                return await this.detailedWidget(vData);
        }
    }

    async simpleWidget(vData) {
        let vehicleData = vData;
        const wSize = 'extraLarge';
        // Defines the Widget Object
        const widget = new ListWidget();
        widget.backgroundGradient = this.FPW.getBgGradient();
        try {
            let mainStack = widget.addStack();
            mainStack.layoutVertically();
            mainStack.setPadding(0, 0, 0, 0);

            let contentStack = mainStack.addStack();
            contentStack.layoutHorizontally();

            //*****************
            //* First column
            //*****************
            let mainCol1 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Vehicle Logo
            await this.WidgetHelpers.createVehicleImageElement(mainCol1, vehicleData, this.FPW.sizeMap[wSize].logoSize.w, this.FPW.sizeMap[wSize].logoSize.h);

            // Creates the Odometer, Fuel/Battery and Distance Info Elements
            await this.createFuelRangeElements(mainCol1, vehicleData, wSize);

            // Creates Low-Voltage Battery Voltage Elements
            await this.createBatteryElement(mainCol1, vehicleData, wSize);

            // Creates Oil Life Elements
            if (!vehicleData.evVehicle) {
                await this.createOilElement(mainCol1, vehicleData, wSize);
            } else {
                // Creates EV Plug Elements
                await this.createEvChargeElement(mainCol1, vehicleData, wSize);
            }

            contentStack.addSpacer();

            //************************
            //* Second column
            //************************
            let mainCol2 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Creates the Lock Status Elements
            await this.createLockStatusElement(mainCol2, vehicleData, wSize);

            // Creates the Door Status Elements
            await this.createDoorElement(mainCol2, vehicleData, false, wSize);

            // Create Tire Pressure Elements
            await this.createTireElement(mainCol2, vehicleData, wSize);

            // mainCol2.addSpacer(0);

            contentStack.addSpacer();

            //****************
            //* Third column
            //****************
            let mainCol3 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Creates the Ignition Status Elements
            await this.createIgnitionStatusElement(mainCol3, vehicleData, wSize);

            // Creates the Door Status Elements
            await this.createWindowElement(mainCol3, vehicleData, false, wSize);

            // Creates the Vehicle Location Element
            await this.createPositionElement(mainCol3, vehicleData, wSize);

            // mainCol3.addSpacer();

            contentStack.addSpacer();

            //**********************
            //* Refresh and error
            //*********************

            let statusRow = await this.WidgetHelpers.createRow(mainStack, { '*layoutHorizontally': null, '*setPadding': [0, 0, 0, 0] });
            await this.createStatusElement(statusRow, vehicleData, wSize);

            // This is the row displaying the time elapsed since last vehicle checkin.
            let timestampRow = await this.WidgetHelpers.createRow(mainStack, { '*layoutHorizontally': null, '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });
            await this.createTimeStampElement(timestampRow, vehicleData, wSize);
        } catch (e) {
            this.FPW.logger(`simpleWidget(extra_large) Error: ${e}`, true);
        }
        return widget;
    }

    async detailedWidget(vData) {
        let vehicleData = vData;
        const wSize = 'extraLarge';
        // Defines the Widget Object
        const widget = new ListWidget();
        widget.backgroundGradient = this.FPW.getBgGradient();
        try {
            let mainStack = widget.addStack();
            mainStack.layoutVertically();
            mainStack.setPadding(0, 0, 0, 0);

            let contentStack = mainStack.addStack();
            contentStack.layoutHorizontally();

            //*****************
            //* First column
            //*****************
            let mainCol1 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Vehicle Logo
            await this.WidgetHelpers.createVehicleImageElement(mainCol1, vehicleData, this.FPW.sizeMap[wSize].logoSize.w, this.FPW.sizeMap[wSize].logoSize.h);

            // Creates the Odometer, Fuel/Battery and Distance Info Elements
            await this.createFuelRangeElements(mainCol1, vehicleData, wSize);

            // Creates Low-Voltage Battery Voltage Elements
            await this.createBatteryElement(mainCol1, vehicleData, wSize);

            // Creates Oil Life Elements
            if (!vehicleData.evVehicle) {
                await this.createOilElement(mainCol1, vehicleData, wSize);
            } else {
                // Creates EV Plug Elements
                await this.createEvChargeElement(mainCol1, vehicleData, wSize);
            }

            contentStack.addSpacer();

            //************************
            //* Second column
            //************************
            let mainCol2 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Creates the Lock Status Elements
            await this.createLockStatusElement(mainCol2, vehicleData, wSize);

            // Creates the Door Status Elements
            await this.createDoorElement(mainCol2, vehicleData, false, wSize);

            // Create Tire Pressure Elements
            await this.createTireElement(mainCol2, vehicleData, wSize);

            // mainCol2.addSpacer(0);

            contentStack.addSpacer();

            //****************
            //* Third column
            //****************
            let mainCol3 = await this.WidgetHelpers.createColumn(contentStack, { '*setPadding': [0, 0, 0, 0] });

            // Creates the Ignition Status Elements
            await this.createIgnitionStatusElement(mainCol3, vehicleData, wSize);

            // Creates the Door Status Elements
            await this.createWindowElement(mainCol3, vehicleData, false, wSize);

            // Creates the Vehicle Location Element
            await this.createPositionElement(mainCol3, vehicleData, wSize);

            // mainCol3.addSpacer();

            contentStack.addSpacer();

            //**********************
            //* Refresh and error
            //*********************

            let statusRow = await this.WidgetHelpers.createRow(mainStack, { '*layoutHorizontally': null, '*setPadding': [0, 0, 0, 0] });
            await this.createStatusElement(statusRow, vehicleData, wSize);

            // This is the row displaying the time elapsed since last vehicle checkin.
            let timestampRow = await this.WidgetHelpers.createRow(mainStack, { '*layoutHorizontally': null, '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });
            await this.createTimeStampElement(timestampRow, vehicleData, wSize);
        } catch (e) {
            this.FPW.logger(`detailedWidget(extra_large) Error: ${e}`, true);
        }
        return widget;
    }

    async createRangeElements(srcField, vehicleData, wSize = 'medium') {
        try {
            const isEV = vehicleData.evVehicle === true;
            let lvlValue = !isEV ? (vehicleData.fuelLevel ? vehicleData.fuelLevel : 0) : vehicleData.evBatteryLevel ? vehicleData.evBatteryLevel : 0;
            let dteValue = !isEV ? (vehicleData.distanceToEmpty ? vehicleData.distanceToEmpty : null) : vehicleData.evDistanceToEmpty ? vehicleData.evDistanceToEmpty : null;
            let dtePostfix = isEV ? 'Range' : 'to E';
            let distanceMultiplier = (await this.FPW.useMetricUnits()) ? 1 : 0.621371; // distance multiplier
            let distanceUnit = (await this.FPW.useMetricUnits()) ? 'km' : 'mi'; // unit of length

            // Fuel/Battery Section
            let elemCol = await this.WidgetHelpers.createColumn(srcField, { '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });

            // Fuel/Battery Level BAR
            let barRow = await this.WidgetHelpers.createRow(elemCol, { '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });
            await this.WidgetHelpers.createImage(barRow, await this.WidgetHelpers.createProgressBar(lvlValue ? lvlValue : 50, vehicleData, wSize), { '*centerAlignImage': null, imageSize: new Size(this.FPW.sizeMap[wSize].barGauge.w, this.FPW.sizeMap[wSize].barGauge.h + 3) });

            // Distance/Range to Empty
            let dteRow = await this.WidgetHelpers.createRow(elemCol, { '*centerAlignContent': null, '*topAlignContent': null });
            let dteInfo = dteValue ? `    ${Math.round(dteValue * distanceMultiplier)}${distanceUnit} ${dtePostfix}` : this.FPW.textMap().errorMessages.noData;
            await this.WidgetHelpers.createText(dteRow, dteInfo, { '*centerAlignText': null, font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 });
            srcField.addSpacer(3);
        } catch (e) {
            this.FPW.logger(`createFuelRangeElements() Error: ${e}`, true);
        }
    }

    async createFuelRangeElements(srcField, vehicleData, wSize = 'medium') {
        try {
            const isEV = vehicleData.evVehicle === true;
            let lvlValue = !isEV ? (vehicleData.fuelLevel ? vehicleData.fuelLevel : 0) : vehicleData.evBatteryLevel ? vehicleData.evBatteryLevel : 0;
            let dteValue = !isEV ? (vehicleData.distanceToEmpty ? vehicleData.distanceToEmpty : null) : vehicleData.evDistanceToEmpty ? vehicleData.evDistanceToEmpty : null;
            let dtePostfix = isEV ? 'Range' : 'to E';
            let distanceMultiplier = (await this.FPW.useMetricUnits()) ? 1 : 0.621371; // distance multiplier
            let distanceUnit = (await this.FPW.useMetricUnits()) ? 'km' : 'mi'; // unit of length
            // console.log('isEV: ' + isEV);
            // console.log(`fuelLevel: ${vehicleData.fuelLevel}`);
            // console.log(`distanceToEmpty: ${vehicleData.distanceToEmpty}`);
            // console.log(`evBatteryLevel: ${vehicleData.evBatteryLevel}`);
            // console.log('evDistanceToEmpty: ' + vehicleData.evDistanceToEmpty);
            // console.log(`lvlValue: ${lvlValue}`);
            // console.log(`dteValue: ${dteValue}`);

            // Fuel/Battery Section
            let elemCol = await this.WidgetHelpers.createColumn(srcField, { '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });

            // Fuel/Battery Level BAR
            let barRow = await this.WidgetHelpers.createRow(elemCol, { '*setPadding': [0, 0, 0, 0], '*centerAlignContent': null });
            await this.WidgetHelpers.createImage(barRow, await this.WidgetHelpers.createProgressBar(lvlValue ? lvlValue : 50, vehicleData, wSize), { '*centerAlignImage': null, imageSize: new Size(this.FPW.sizeMap[wSize].barGauge.w, this.FPW.sizeMap[wSize].barGauge.h + 3) });

            // Distance to Empty
            let dteRow = await this.WidgetHelpers.createRow(elemCol, { '*centerAlignContent': null, '*topAlignContent': null });
            let dteInfo = dteValue ? `    ${Math.round(dteValue * distanceMultiplier)}${distanceUnit} ${dtePostfix}` : this.FPW.textMap().errorMessages.noData;
            await this.WidgetHelpers.createText(dteRow, dteInfo, { '*centerAlignText': null, font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 });
            srcField.addSpacer(3);
        } catch (e) {
            this.FPW.logger(`createFuelRangeElements() Error: ${e}`, true);
        }
    }

    async createBatteryElement(srcField, vehicleData, wSize = 'medium') {
        try {
            let elem = await this.WidgetHelpers.createRow(srcField, { '*layoutHorizontally': null, '*bottomAlignContent': null });
            await this.WidgetHelpers.createTitle(elem, 'batteryStatus', wSize, this.FPW.isSmallDisplay || wSize === 'small');
            elem.addSpacer(2);
            let value = vehicleData.batteryLevel ? `${vehicleData.batteryLevel}V` : 'N/A';
            // console.log(`batteryLevel: ${value}`);
            let lowBattery = vehicleData.batteryStatus === 'STATUS_LOW' ? true : false;
            await this.WidgetHelpers.createText(elem, value, { font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: lowBattery ? Color.red() : new Color(this.FPW.colorMap.textColor2), lineLimit: 1 });
            srcField.addSpacer(3);
        } catch (e) {
            this.FPW.logger(`createBatteryElement() Error: ${e}`, true);
        }
    }

    async createOilElement(srcField, vData, wSize = 'medium') {
        try {
            const styles = {
                normal: { font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 },
                warning: { font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color('#FF6700'), lineLimit: 1 },
                critical: { font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color('#DE1738'), lineLimit: 1 },
            };
            let elem = await this.WidgetHelpers.createRow(srcField, { '*layoutHorizontally': null, '*bottomAlignContent': null });
            await this.WidgetHelpers.createTitle(elem, 'oil', wSize, this.FPW.isSmallDisplay || wSize === 'small');
            elem.addSpacer(2);
            let txtStyle = styles.normal;
            if (vData.oilLife && vData.oilLife >= 0 && vData.oilLife <= 25) {
                txtStyle = styles.warning;
            }
            // console.log(`oilLife: ${vData.oilLife}`);
            let text = vData.oilLife ? `${vData.oilLife}%` : this.FPW.textMap().errorMessages.noData;
            await this.WidgetHelpers.createText(elem, text, txtStyle);
            srcField.addSpacer(3);
        } catch (e) {
            this.FPW.logger(`createOilElement() Error: ${e}`, true);
        }
    }

    async createEvChargeElement(srcField, vehicleData, wSize = 'medium') {
        try {
            let elem = await this.WidgetHelpers.createRow(srcField, { '*layoutHorizontally': null });
            await this.WidgetHelpers.createTitle(elem, 'evChargeStatus', wSize, this.FPW.isSmallDisplay || wSize === 'small');
            elem.addSpacer(2);
            let value = vehicleData.evChargeStatus ? `${vehicleData.evChargeStatus}` : this.FPW.textMap().errorMessages.noData;
            // console.log(`battery charge: ${value}`);
            await this.WidgetHelpers.createText(elem, value, { font: Font.regularSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 });
            srcField.addSpacer(3);
        } catch (e) {
            this.FPW.logger(`createEvChargeElement() Error: ${e}`, true);
        }
    }

    async createDoorElement(srcField, vData, countOnly = false, wSize = 'medium') {
        try {
            const styles = {
                normTxt: { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 },
                statOpen: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#FF5733'), lineLimit: 1 },
                statClosed: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#5A65C0'), lineLimit: 1 },
                offset: 5,
            };

            let offset = styles.offset;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createTitle(titleFld, 'doors', wSize);

            // Creates the first row of status elements for LF and RF
            let dataRow1Fld = await this.WidgetHelpers.createRow(srcField);

            if (countOnly) {
                let value = this.FPW.textMap().errorMessages.noData;
                // let allDoorsCnt = Object.values(vData.statusDoors).filter((door) => door !== null).length;
                let countOpen;
                if (vData.statusDoors) {
                    countOpen = Object.values(vData.statusDoors).filter((door) => door === true).length;
                    value = countOpen == 0 ? this.FPW.textMap().UIValues.closed : `${countOpen} ${this.FPW.textMap().UIValues.open}`;
                }
                await this.WidgetHelpers.createText(dataRow1Fld, value, countOpen > 0 ? styles.statOpen : styles.statClosed);
            } else {
                let col1 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 0, 0, 0] });
                let col1row1 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col1row1, 'LF (', styles.normTxt);
                await this.WidgetHelpers.createText(col1row1, vData.statusDoors.driverFront ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusDoors.driverFront ? styles.statOpen : styles.statClosed);
                await this.WidgetHelpers.createText(col1row1, ')', styles.normTxt);

                let col2 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 3, 0, 3] });
                let col2row1 = await this.WidgetHelpers.createRow(col2, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col2row1, '|', styles.normTxt);

                let col3 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 0, 0, 0] });
                let col3row1 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col3row1, 'RF (', styles.normTxt);
                await this.WidgetHelpers.createText(col3row1, vData.statusDoors.passFront ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusDoors.passFront ? styles.statOpen : styles.statClosed);
                await this.WidgetHelpers.createText(col3row1, ')', styles.normTxt);

                // Creates the second row of status elements for LR and RR
                if (vData.statusDoors.leftRear !== null && vData.statusDoors.rightRear !== null) {
                    let col1row2 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
                    await this.WidgetHelpers.createText(col1row2, `LR (`, styles.normTxt);
                    await this.WidgetHelpers.createText(col1row2, vData.statusDoors.leftRear ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusDoors.leftRear ? styles.statOpen : styles.statClosed);
                    await this.WidgetHelpers.createText(col1row2, ')', styles.normTxt);

                    let col2row2 = await this.WidgetHelpers.createRow(col2, {});
                    await this.WidgetHelpers.createText(col2row2, '|', styles.normTxt);

                    let col3row2 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
                    await this.WidgetHelpers.createText(col3row2, `RR (`, styles.normTxt);
                    await this.WidgetHelpers.createText(col3row2, vData.statusDoors.rightRear ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusDoors.rightRear ? styles.statOpen : styles.statClosed);
                    await this.WidgetHelpers.createText(col3row2, ')', styles.normTxt);
                }

                let that = this;
                async function getHoodStatusElem(stkElem, data, center = false) {
                    try {
                        await that.WidgetHelpers.createText(stkElem, `${center ? '       ' : ''}HD (`, styles.normTxt);
                        await that.WidgetHelpers.createText(stkElem, data.statusDoors.hood ? that.FPW.textMap().symbols.open : that.FPW.textMap().symbols.closed, vData.statusDoors.hood ? styles.statOpen : styles.statClosed);
                        await that.WidgetHelpers.createText(stkElem, ')', styles.normTxt);
                    } catch (e) {
                        that.FPW.logger(`getHoodStatusElem() Error: ${e}`, true);
                    }
                }
                async function getTailgateStatusElem(stkElem, data, center = false) {
                    try {
                        await that.WidgetHelpers.createText(stkElem, `${center ? '       ' : ''}TG (`, styles.normTxt);
                        await that.WidgetHelpers.createText(stkElem, data.statusDoors.tailgate ? that.FPW.textMap().symbols.open : that.FPW.textMap().symbols.closed, vData.statusDoors.tailgate ? styles.statOpen : styles.statClosed);
                        await that.WidgetHelpers.createText(stkElem, ')', styles.normTxt);
                    } catch (e) {
                        that.FPW.logger(`getTailgateStatusElem() Error: ${e}`, true);
                    }
                }

                // Creates the third row of status elements for the tailgate and/or hood (if equipped)
                let hasHood = vData.statusDoors.hood !== null;
                let hasTailgate = vData.statusDoors.tailgate !== null;
                if (hasHood || hasTailgate) {
                    if (hasHood && hasTailgate) {
                        let col1row3 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
                        await getHoodStatusElem(col1row3, vData);

                        let col2row3 = await this.WidgetHelpers.createRow(col2, {});
                        await this.WidgetHelpers.createText(col2row3, '|', styles.normTxt);

                        let col3row3 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
                        await getTailgateStatusElem(col3row3, vData);
                    } else {
                        if (hasHood && !hasTailgate) {
                            let dataRow3Fld = await this.WidgetHelpers.createRow(srcField);
                            await getHoodStatusElem(dataRow3Fld, vData, true);
                        } else if (hasTailgate && !hasHood) {
                            let dataRow3Fld = await this.WidgetHelpers.createRow(srcField, {});
                            await getTailgateStatusElem(dataRow3Fld, vData, true);
                        }
                    }
                }
            }
            srcField.addSpacer(offset);
        } catch (err) {
            this.FPW.logger(`createStatusDoors() Error: ${err}`, true);
        }
    }

    async createWindowElement(srcField, vData, countOnly = false, wSize = 'medium') {
        try {
            const styles = {
                normTxt: { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color(this.FPW.colorMap.textColor2) },
                statOpen: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#FF5733') },
                statClosed: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#5A65C0') },
                offset: 10,
            };

            let offset = styles.offset;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createTitle(titleFld, 'windows', wSize);

            // Creates the first row of status elements for LF and RF
            let dataRow1Fld = await this.WidgetHelpers.createRow(srcField);
            if (countOnly) {
                let value = this.FPW.textMap().errorMessages.noData;
                let countOpen;
                if (vData.statusWindows) {
                    countOpen = Object.values(vData.statusWindows).filter((window) => window === true).length;
                    value = countOpen == 0 ? this.FPW.textMap().UIValues.closed : `${countOpenWindows} ${this.FPW.textMap().UIValues.open}`;
                }
                await this.WidgetHelpers.createText(dataRow1Fld, value, countOpen > 0 ? styles.statOpen : styles.statClosed);
            } else {
                let col1 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 0, 0, 0] });
                let col1row1 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col1row1, 'LF (', styles.normTxt);
                await this.WidgetHelpers.createText(col1row1, vData.statusWindows.driverFront ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusWindows['driverFront'] ? styles.statOpen : styles.statClosed);
                await this.WidgetHelpers.createText(col1row1, ')', styles.normTxt);

                let col2 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 3, 0, 3] });
                let col2row1 = await this.WidgetHelpers.createRow(col2, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col2row1, '|', styles.normTxt);

                let col3 = await this.WidgetHelpers.createColumn(dataRow1Fld, { '*setPadding': [0, 0, 0, 0] });
                let col3row1 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
                await this.WidgetHelpers.createText(col3row1, 'RF (', styles.normTxt);
                await this.WidgetHelpers.createText(col3row1, vData.statusWindows['passFront'] ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusWindows['passFront'] ? styles.statOpen : styles.statClosed);
                await this.WidgetHelpers.createText(col3row1, ')', styles.normTxt);

                // Creates the second row of status elements for LR and RR
                if (vData.statusWindows.driverRear !== null && vData.statusWindows.passRear !== null) {
                    let col1row2 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
                    await this.WidgetHelpers.createText(col1row2, `LR (`, styles.normTxt);
                    await this.WidgetHelpers.createText(col1row2, vData.statusWindows.driverRear ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusWindows.driverRear ? styles.statOpen : styles.statClosed);
                    await this.WidgetHelpers.createText(col1row2, ')', styles.normTxt);

                    let col2row2 = await this.WidgetHelpers.createRow(col2, {});
                    await this.WidgetHelpers.createText(col2row2, '|', styles.normTxt);

                    let col3row2 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
                    await this.WidgetHelpers.createText(col3row2, `RR (`, styles.normTxt);
                    await this.WidgetHelpers.createText(col3row2, vData.statusWindows.passRear ? this.FPW.textMap().symbols.open : this.FPW.textMap().symbols.closed, vData.statusWindows.passRear ? styles.statOpen : styles.statClosed);
                    await this.WidgetHelpers.createText(col3row2, ')', styles.normTxt);
                }

                if (vData.statusDoors['tailgate'] !== undefined || vData.statusDoors['hood'] !== undefined) {
                    offset = offset + 10;
                }
            }
            srcField.addSpacer(offset);
        } catch (e) {
            this.FPW.logger(`createWindowElement() Error: ${e}`, true);
        }
    }

    async createTireElement(srcField, vData, wSize = 'medium') {
        try {
            const styles = {
                normTxt: { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color(this.FPW.colorMap.textColor2) },
            };
            let offset = 0;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            let pressureUnits = await this.FPW.getSettingVal('fpPressureUnits');
            let unitTxt = pressureUnits.toLowerCase() === 'kpa' ? 'kPa' : pressureUnits.toLowerCase();
            await this.WidgetHelpers.createTitle(titleFld, `tirePressure||${unitTxt}`, wSize);

            let dataFld = await this.WidgetHelpers.createRow(srcField);
            // Row 1 - Tire Pressure Left Front amd Right Front
            let col1 = await this.WidgetHelpers.createColumn(dataFld, { '*setPadding': [0, 0, 0, 0] });
            let col1row1 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col1row1, vData.tirePressure.leftFront, this.WidgetHelpers.getTirePressureStyle(vData.tirePressure.leftFront, unitTxt));
            let col2 = await this.WidgetHelpers.createColumn(dataFld, { '*setPadding': [0, 3, 0, 3] });
            let col2row1 = await this.WidgetHelpers.createRow(col2, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col2row1, '|', styles.normTxt);
            let col3 = await this.WidgetHelpers.createColumn(dataFld, { '*setPadding': [0, 0, 0, 0] });
            let col3row1 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col3row1, vData.tirePressure.rightFront, this.WidgetHelpers.getTirePressureStyle(vData.tirePressure.rightFront, unitTxt));

            // Row 2 - Tire Pressure Left Rear amd Right Rear
            let col1row2 = await this.WidgetHelpers.createRow(col1, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col1row2, vData.tirePressure.leftRear, this.WidgetHelpers.getTirePressureStyle(vData.tirePressure.leftRear, unitTxt));
            let col2row2 = await this.WidgetHelpers.createRow(col2, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col2row2, '|', styles.normTxt);
            let col3row2 = await this.WidgetHelpers.createRow(col3, { '*setPadding': [0, 0, 0, 0] });
            await this.WidgetHelpers.createText(col3row2, vData.tirePressure.rightRear, this.WidgetHelpers.getTirePressureStyle(vData.tirePressure.rightRear, unitTxt));

            srcField.addSpacer(offset);
        } catch (e) {
            this.FPW.logger(`createTireElement() Error: ${e}`, true);
        }
    }

    async createPositionElement(srcField, vehicleData, wSize = 'medium') {
        try {
            let offset = 0;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createTitle(titleFld, 'position', wSize);

            let dataFld = await this.WidgetHelpers.createRow(srcField);
            let url = (await this.FPW.getMapProvider()) == 'google' ? `https://www.google.com/maps/search/?api=1&query=${vehicleData.latitude},${vehicleData.longitude}` : `http://maps.apple.com/?q=${encodeURI(vehicleData.info.vehicle.nickName)}&ll=${vehicleData.latitude},${vehicleData.longitude}`;
            let value = vehicleData.position ? (this.widgetConfig.screenShotMode ? '1234 Someplace Drive, Somewhere' : `${vehicleData.position}`) : this.FPW.textMap().errorMessages.noData;
            await this.WidgetHelpers.createText(dataFld, value, { url: url, font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 2, minimumScaleFactor: 0.7 });
            srcField.addSpacer(offset);
        } catch (e) {
            this.FPW.logger(`createPositionElement() Error: ${e}`, true);
        }
    }

    async createLockStatusElement(srcField, vehicleData, wSize = 'medium') {
        try {
            const styles = {
                unlocked: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#FF5733'), lineLimit: 1 },
                locked: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#5A65C0'), lineLimit: 1 },
            };
            let offset = 2;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createTitle(titleFld, 'lockStatus', wSize);
            titleFld.addSpacer(2);
            let dataFld = await this.WidgetHelpers.createRow(srcField);
            let value = vehicleData.lockStatus ? vehicleData.lockStatus.toLowerCase().charAt(0).toUpperCase() + vehicleData.lockStatus.toLowerCase().slice(1) : this.FPW.textMap().errorMessages.noData;
            await this.WidgetHelpers.createText(dataFld, value, vehicleData.lockStatus !== undefined && vehicleData.lockStatus === 'LOCKED' ? styles.locked : styles.unlocked);
            srcField.addSpacer(offset);
        } catch (e) {
            this.FPW.logger(`createLockStatusElement() Error: ${e}`, true);
        }
    }

    async createIgnitionStatusElement(srcField, vehicleData, wSize = 'medium') {
        try {
            const styles = {
                on: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#FF5733') },
                off: { font: Font.heavySystemFont(this.FPW.sizeMap[wSize].fontSizeMedium), textColor: new Color('#5A65C0') },
            };
            let remStartOn = vehicleData.remoteStartStatus && vehicleData.remoteStartStatus.running ? true : false;
            let status = '';
            if (remStartOn) {
                status = `Remote Start (ON)`;
            } else if (vehicleData.ignitionStatus !== undefined) {
                status = vehicleData.ignitionStatus.charAt(0).toUpperCase() + vehicleData.ignitionStatus.slice(1); //vehicleData.ignitionStatus.toUpperCase();
            } else {
                this.FPW.textMap().errorMessages.noData;
            }
            let offset = 2;
            let titleFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createTitle(titleFld, 'ignitionStatus', wSize);
            titleFld.addSpacer(2);
            let dataFld = await this.WidgetHelpers.createRow(srcField);
            await this.WidgetHelpers.createText(dataFld, status, vehicleData.ignitionStatus !== undefined && (vehicleData.ignitionStatus === 'On' || vehicleData.ignitionStatus === 'Run' || remStartOn) ? styles.on : styles.off);
            srcField.addSpacer(offset);
        } catch (e) {
            this.FPW.logger(`createIgnitionStatusElement() Error: ${e}`, true);
        }
    }

    async createTimeStampElement(stk, vehicleData, wSize = 'medium') {
        try {
            // stk.setPadding(topOffset, leftOffset, bottomOffset, rightOffset);
            // Creates the Refresh Label to show when the data was last updated from Ford
            let refreshTime = vehicleData.lastRefreshElapsed ? vehicleData.lastRefreshElapsed : this.FPW.textMap().UIValues.unknown;
            await this.WidgetHelpers.createText(stk, 'Updated: ' + refreshTime, { font: Font.mediumSystemFont(8), textColor: Color.lightGray(), lineLimit: 1 });
            return stk;
        } catch (e) {
            this.FPW.logger(`createTimeStampElement() Error: ${e}`, true);
        }
    }

    async hasStatusMsg(vData) {
        return vData.error || (!vData.evVehicle && vData.batteryStatus === 'STATUS_LOW') || vData.deepSleepMode || vData.firmwareUpdating || this.FPW.getStateVal('updateAvailable') === true; //|| (!vData.evVehicle && vData.oilLow)
    }

    async createStatusElement(stk, vData, maxMsgs = 2, wSize = 'medium') {
        try {
            let cnt = 0;
            // Creates Elements to display any errors in red at the bottom of the widget
            if (vData.error) {
                // stk.addSpacer(5);
                await this.WidgetHelpers.createText(stk, vData.error ? 'Error: ' + vData.error : '', { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.red() });
            } else {
                if (cnt < maxMsgs && !vData.evVehicle && vData.batteryStatus === 'STATUS_LOW') {
                    stk.addSpacer(cnt > 0 ? 5 : 0);
                    await this.WidgetHelpers.createText(stk, `\u2022 12V Battery Low`, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.red(), lineLimit: 1 });
                    cnt++;
                }
                // if (cnt < maxMsgs && !vData.evVehicle && vData.oilLow) {
                //     stk.addSpacer(cnt > 0 ? 5 : 0);
                //     await createText(stk, `\u2022 Oil Reporting Low`, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.red(), lineLimit: 1 });
                //     cnt++;
                // }
                if (cnt < maxMsgs && vData.deepSleepMode) {
                    stk.addSpacer(cnt > 0 ? 5 : 0);
                    await this.WidgetHelpers.createText(stk, `\u2022 Deep Sleep Mode`, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.orange(), lineLimit: 1 });
                    cnt++;
                }
                if (cnt < maxMsgs && vData.firmwareUpdating) {
                    stk.addSpacer(cnt > 0 ? 5 : 0);
                    await this.WidgetHelpers.createText(stk, `\u2022 Firmware Updating`, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.green(), lineLimit: 1 });
                    cnt++;
                }
                if (cnt < maxMsgs && this.FPW.getStateVal('updateAvailable') === true) {
                    stk.addSpacer(cnt > 0 ? 5 : 0);
                    await this.WidgetHelpers.createText(stk, `\u2022 Script Update: v${this.FPW.getStateVal('LATEST_VERSION')}`, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: Color.orange(), lineLimit: 1 });
                    cnt++;
                }
            }
            if (!this.hasStatusMsg()) {
                await this.WidgetHelpers.createText(stk, `     `, { font: Font.mediumSystemFont(this.FPW.sizeMap[wSize].fontSizeSmall), textColor: new Color(this.FPW.colorMap.textColor2), lineLimit: 1 });
            }
            return stk;
        } catch (e) {
            this.FPW.logger(`createStatusElement() Error: ${e}`, true);
        }
    }
};