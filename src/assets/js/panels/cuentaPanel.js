/**
 * @author 2K Studio
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { database, changePanel, accountSelect, Slider } from '../utils.js';

const os = require('os');

class Cuentas {
    static id = "cuentaPanel";
    async init(config) {
        this.initTab();
    }

    initAccount() {
        document.querySelector('.accounts').addEventListener('click', async(e) => {
            let uuid = e.target.id;
            let selectedaccount = await this.database.get('1234', 'accounts-selected');

            if (e.path[0].classList.contains('account')) {
                accountSelect(uuid);
                this.database.update({ uuid: "1234", selected: uuid }, 'accounts-selected');
            }

            if (e.target.classList.contains("account-delete")) {
                this.database.delete(e.path[1].id, 'accounts');

                document.querySelector('.accounts').removeChild(e.path[1])
                if (!document.querySelector('.accounts').children.length) {
                    changePanel("login");
                    return
                }

                if (e.path[1].id === selectedaccount.value.selected) {
                    let uuid = (await this.database.getAll('accounts'))[0].value.uuid
                    this.database.update({
                        uuid: "1234",
                        selected: uuid
                    }, 'accounts-selected')
                    accountSelect(uuid)
                }
            }
        })

        document.querySelector('.add-account').addEventListener('click', () => {
            document.querySelector(".cancel-login").style.display = "contents";
            changePanel("login");
        })
    }

    initTab() {
        let TabBtn = document.querySelectorAll('.tab-btn2');
        let TabContent = document.querySelectorAll('.tabs-settings-content2');

        for (let i = 0; i < TabBtn.length; i++) {
            TabBtn[i].addEventListener('click', () => {
                if (TabBtn[i].classList.contains('save-tabs-btn2')) return
                for (let j = 0; j < TabBtn.length; j++) {
                    TabContent[j].classList.remove('active-tab-content2');
                    TabBtn[j].classList.remove('active-tab-btn2');
                }
                TabContent[i].classList.add('active-tab-content2');
                TabBtn[i].classList.add('active-tab-btn2');
            });
        }

        document.querySelector('.save-tabs-btn2').addEventListener('click', () => {
            document.querySelector('.default-tab-btn2').click();
            changePanel("home");
        })
    }
}
export default Cuentas;