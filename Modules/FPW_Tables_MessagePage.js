const darkMode = Device.isUsingDarkAppearance();
module.exports = class FPW_Tables_MessagePage {
    constructor(FPW) {
        this.FPW = FPW;
        this.SCRIPT_ID = FPW.SCRIPT_ID;
        this.widgetConfig = FPW.widgetConfig;
    }

    async createMessagesPage(vData, unreadOnly = false, update = false) {
        try {
            let msgs = vData.messages && vData.messages && vData.messages && vData.messages.length ? vData.messages : messageTest || [];
            msgs = unreadOnly ? msgs.filter((msg) => msg.isRead === false) : msgs;

            let tableRows = [];

            if (msgs.length > 0) {
                tableRows.push(
                    await this.FPW.Tables.createTableRow(
                        [
                            await this.FPW.Tables.createTextCell('', undefined, { align: 'left', widthWeight: 20 }),
                            await this.FPW.Tables.createTextCell(`${msgs.length} Messages(s)`, undefined, { align: 'center', widthWeight: 60, dismissOnTap: false, titleColor: this.FPW.colorMap.normalText, titleFont: Font.title2() }),
                            await this.FPW.Tables.createTextCell('All', undefined, { align: 'right', widthWeight: 20, dismissOnTap: false, titleColor: Color.purple(), titleFont: Font.title2() }),
                        ], {
                            height: 40,
                            dismissOnSelect: false,
                            onSelect: async() => {
                                console.log(`(Messages Table) All Message Options was pressed`);
                                let msgIds = msgs.map((msg) => msg.messageId);
                                await this.FPW.Alerts.showActionPrompt(
                                    'All Message Options',
                                    undefined, [{
                                            title: 'Mark All Read',
                                            action: async() => {
                                                console.log(`(Messages Table) Mark All Messages Read was pressed`);
                                                let ok = await this.FPW.Alerts.showPrompt(`All Message Options`, `Are you sure you want to mark all messages as read?`, `Mark (${msgIds.length}) Read`, true);
                                                if (ok) {
                                                    console.log(`(Messages Table) Marking ${msgIds.length} Messages as Read`);
                                                    if (await this.FPW.FordAPI.markMultipleUserMessagesRead(msgIds)) {
                                                        console.log(`(Messages Table) Marked (${msgIds.length}) Messages as Read Successfully`);
                                                        this.FPW.Alerts.showAlert('Marked Messages as Read Successfully', 'Message List will reload after data is refeshed');
                                                        await this.createMessagesPage(await this.FPW.FordAPI.fetchVehicleData(false), unreadOnly, true);
                                                        this.FPW.Tables.MainPage.createMainPage(true);
                                                    }
                                                }
                                            },
                                            destructive: false,
                                            show: true,
                                        },
                                        {
                                            title: 'Delete All',
                                            action: async() => {
                                                console.log(`(Messages Table) Delete All Messages was pressed`);
                                                let ok = await this.FPW.Alerts.showPrompt('Delete All Messages', 'Are you sure you want to delete all messages?', `Delete (${msgIds.length}) Messages`, true);
                                                if (ok) {
                                                    console.log(`(Messages Table) Deleting ${msgIds.length} Messages`);
                                                    if (await this.FPW.FordAPI.deleteUserMessages([msg.messageId])) {
                                                        console.log(`(Messages Table) Deleted (${msgIds.length}) Messages Successfully`);
                                                        this.FPW.Alerts.showAlert('Deleted Messages Successfully', 'Message List will reload after data is refeshed');
                                                        await this.createMessagesPage(await this.FPW.FordAPI.fetchVehicleData(false), unreadOnly, true);
                                                        this.FPW.Tables.MainPage.createMainPage(true);
                                                    }
                                                }
                                            },
                                            destructive: true,
                                            show: true,
                                        },
                                    ],
                                    true,
                                    async() => {
                                        this.createMessagesPage(vData, unreadOnly);
                                    },
                                );
                            },
                        },
                    ),
                );

                for (const [i, msg] of msgs.entries()) {
                    let dtTS = msg.createdDate ? this.FPW.convertFordDtToLocal(msg.createdDate) : undefined;
                    let timeDiff = dtTS ? this.FPW.timeDifference(dtTS) : '';
                    let timeSubtitle = `${dtTS ? dtTS.toLocaleString() : ''}${timeDiff ? ' (' + timeDiff + ')' : ''}`;

                    // Creates Message Header Row
                    tableRows.push(await this.FPW.Tables.createTableRow([await this.FPW.Tables.createTextCell('', undefined, { align: 'center', widthWeight: 1 })], { backgroundColor: msg.isRead === false ? new Color('#008200') : Color.darkGray(), height: 10, dismissOnSelect: false }));
                    tableRows.push(
                        await this.FPW.Tables.createTableRow(
                            [
                                await this.FPW.Tables.createImageCell(await this.FPW.Files.getFPImage(`ic_message_center_notification_${darkMode ? 'dark' : 'light'}.png`), { align: 'center', widthWeight: 10 }),
                                await this.FPW.Tables.createTextCell(this.FPW.Tables.getMessageDescByType(msg.messageType), undefined, { align: 'left', widthWeight: 55, titleColor: this.FPW.colorMap.normalText, titleFont: Font.body() }),
                                await this.FPW.Tables.createTextCell(msg.isRead === false ? 'Unread' : 'Read', undefined, { align: 'right', widthWeight: 25, titleColor: msg.isRead === false ? new Color('#008200') : Color.darkGray(), titleFont: Font.body() }),
                                await this.FPW.Tables.createTextCell('...', undefined, { align: 'right', widthWeight: 10, dismissOnTap: false, titleColor: Color.purple(), titleFont: Font.title2() }),
                            ], {
                                height: 40,
                                dismissOnSelect: false,
                                onSelect: async() => {
                                    console.log(`(Messages Table) Message Options button was pressed for ${msg.messageId}`);
                                    await this.FPW.Alerts.showActionPrompt(
                                        'Message Options',
                                        undefined, [{
                                                title: 'Mark as Read',
                                                action: async() => {
                                                    console.log(`(Messages Table) Marking Message with ID: ${msg.messageId} as Read...`);
                                                    if (await this.FPW.FordAPI.markMultipleUserMessagesRead([msg.messageId])) {
                                                        console.log(`(Messages Table) Message (${msg.messageId}) marked read successfully`);
                                                        this.FPW.Alerts.showAlert('Message marked read successfully', 'Message List will reload after data is refeshed');
                                                        await this.createMessagesPage(await this.FPW.FordAPI.fetchVehicleData(false), unreadOnly, true);
                                                        this.FPW.Tables.MainPage.createMainPage(true);
                                                    }
                                                },
                                                destructive: false,
                                                show: true,
                                            },
                                            {
                                                title: 'Delete Message',
                                                action: async() => {
                                                    console.log(`(Messages Table) Delete Message ${msg.messageId} was pressed`);
                                                    let ok = await this.FPW.Alerts.showPrompt('Delete Message', 'Are you sure you want to delete this message?', 'Delete', true);
                                                    if (ok) {
                                                        console.log(`(Messages Table) Delete Confirmed for Message ID: ${msg.messageId}`);
                                                        if (await this.FPW.FordAPI.deleteUserMessages([msg.messageId])) {
                                                            console.log(`(Messages Table) Message ${msg.messageId} deleted successfully`);
                                                            this.FPW.Alerts.showAlert('Message deleted successfully', 'Message List will reload after data is refeshed');
                                                            await this.createMessagesPage(await this.FPW.FordAPI.fetchVehicleData(false), unreadOnly, true);
                                                            this.FPW.Tables.MainPage.createMainPage(true);
                                                            up;
                                                        } else {
                                                            await this.createMessagesPage(vData, unreadOnly);
                                                        }
                                                    }
                                                },
                                                destructive: true,
                                                show: true,
                                            },
                                        ],
                                        true,
                                        async() => {
                                            await this.createMessagesPage(vData, unreadOnly);
                                        },
                                    );
                                },
                            },
                        ),
                    );

                    // Creates Message Subject Row
                    tableRows.push(
                        await this.FPW.Tables.createTableRow([await this.FPW.Tables.createTextCell(msg.messageSubject, timeSubtitle, { align: 'left', widthWeight: 100, titleColor: this.FPW.colorMap.normalText, titleFont: Font.headline(), subtitleColor: Color.lightGray(), subtitleFont: Font.mediumSystemFont(11) })], {
                            height: 44,
                            dismissOnSelect: false,
                        }),
                    );

                    // Creates Message Subject and Body Row
                    tableRows.push(await this.FPW.Tables.createTableRow([await this.FPW.Tables.createTextCell(msg.messageBody, undefined, { align: 'left', widthWeight: 100, titleColor: this.FPW.colorMap.normalText, titleFont: Font.body() })], { height: this.FPW.Tables.getRowHeightByTxtLength(msg.messageBody) + 10, dismissOnSelect: false }));
                }
            } else {
                tableRows.push(
                    await this.FPW.Tables.createTableRow(
                        [
                            await this.FPW.Tables.createTextCell('', undefined, { align: 'left', widthWeight: 20 }),
                            await this.FPW.Tables.createTextCell(`${msgs.length} Messages(s)`, undefined, { align: 'center', widthWeight: 60, dismissOnTap: false, titleColor: this.FPW.colorMap.normalText, titleFont: Font.title2() }),
                            await this.FPW.Tables.createTextCell('', undefined, { align: 'right', widthWeight: 20 }),
                        ], { height: 44, dismissOnSelect: false },
                    ),
                );
                tableRows.push(await this.FPW.Tables.createTableRow([await this.FPW.Tables.createTextCell(this.FPW.textMap().errorMessages.noMessages, undefined, { align: 'left', widthWeight: 1, titleColor: this.FPW.colorMap.normalText, titleFont: Font.title3() })], { height: 44, dismissOnSelect: false }));
            }
            await this.FPW.Tables.generateTableMenu('messages', tableRows, false, this.FPW.isPhone, update);
        } catch (e) {
            this.FPW.logger(`createMessagesPage() error: ${e}`, true);
        }
    }
};