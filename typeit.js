/**
 * TypeIt.js
 * @version 1.0
 * @author CKylinMC
 */

(function () {
    class TypeIt{
        dom = null;
        nodeBackup = null;
        hostingDom = null;
        typingDom = null;
        stage = "stop";
        workId = 0;
        options = {
            speed: 60,
            randomRange: [20, 250],
            stutterSpace: 200,
            lineGag: 2000,
            text: [],
            loop: false,
            mode: "type", // one line typing
            // mode: "loop", // multi line typing loop
            // mode: "forwards", // multi line typing but once
            // mode: "random", // multi line typing random
        };
        doneCallbacks = [];

        static init() {
            let style = document.head.querySelector("style.typeit-style");
            if (!style) {
                style = document.createElement("style");
                document.head.appendChild(style);
                style.classList.add("typeit-style");
            }
            style.innerHTML = "";
            style.appendChild(document.createTextNode(`.typeit-typing{
                border-right: 2px black solid;
                animation: typeit-cursor 1.25s infinite;
            }
            
            @keyframes typeit-cursor {
                from, to {
                    border-right-color: rgba(0, 0, 0, 0.75);
                }
                50% {
                    border-right-color: transparent;
                }
            }
            
            @-o-keyframes typeit-cursor {
                from, to {
                    border-right-color: rgba(0, 0, 0, 0.75);
                }
                50% {
                    border-right-color: transparent;
                }
            }
            
            @-moz-keyframes typeit-cursor {
                from, to {
                    border-right-color: rgba(0, 0, 0, 0.75);
                }
                50% {
                    border-right-color: transparent;
                }
            }
            
            @-webkit-keyframes typeit-cursor {
                from, to {
                    border-right-color: rgba(0, 0, 0, 0.75);
                }
                50% {
                    border-right-color: transparent;
                }
            }
            
            @-ms-keyframes typeit-cursor {
                from, to {
                    border-right-color: rgba(0, 0, 0, 0.75);
                }
                50% {
                    border-right-color: transparent;
                }
            }
            
            `));
        }

        static random(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        static wait(ms = 0) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        constructor(dom, options = {}) {
            if (typeof (dom) === "string") {
                dom = document.querySelector(dom);
            }
            if (!dom) throw "TypeIt: dom is null";
            this.dom = dom;
            this.hostingDom = dom;
            this.options = Object.assign(this.options, options);
            console.log(this.options);
            if (!this.options.text || this.options.text.length === 0) {
                this.options.text = [dom.innerText];
            } else if(typeof(this.options.text)==="string") {
                this.options.text = [this.options.text];
            }
        }
        onDone(cb) {
            this.doneCallbacks.push(cb);
        }
        async done() {
            this.doneCallbacks.forEach(cb => cb());
        }
        animDom() {
            let d = document.createElement("span");
            d.classList.add("typeit-typing-mark");
            return d;
        }
        setAnim(visible = true) {
            if (this.typingDom) {
                if (visible) {
                    this.typingDom.classList?.add("typeit-typing");
                } else {
                    this.typingDom.classList?.remove("typeit-typing");
                }
            }
        }
        prepareNode() {
            this.nodeBackup = this.dom.cloneNode(true);
            this.dom = document.createElement("span");
            this.dom.classList.add("typeit-text", ...this.nodeBackup.classList);
            this.dom.innerHTML = this.nodeBackup.innerHTML;
            this.hostingDom.innerHTML = "";
            this.hostingDom.appendChild(this.dom);
            this.typingDom = this.animDom();
            this.hostingDom.appendChild(this.typingDom);
        }
        persistNode() {
            this.nodeBackup.innerHTML = this.dom.innerHTML;
        }
        recoverNode() {
            this.typingDom.remove();
            this.typingDom = null;
            this.hostingDom.replaceWith(this.nodeBackup);
            this.hostingDom = this.nodeBackup;
            this.dom = this.hostingDom;
        }
        start() {
            this.stage = "type";
            if (this.options.mode == "type") {
                this.prepareNode();
                this.dom.innerHTML = "";
                this.type(this.options.text[0]).then(() => {
                    this.recoverNode();
                    this.done();
                });
            } else if (["loop","forwards","random"].includes(this.options.mode)) {
                this.startLoop();
            } else {
                console.warn("TypeIt: Unknown mode: " + this.options.mode);
            }
        }
        type(currentText) {
            return new Promise(async r => {
                let strIndex = 0;
                this.setAnim(true);
                while (strIndex < currentText.length) {
                    let thisChar = currentText[strIndex++];
                    this.dom.innerHTML += thisChar;
                    await TypeIt.wait(this.options.speed
                        + TypeIt.random(this.options.randomRange[0], this.options.randomRange[1])
                        + (thisChar == " " || thisChar == "\n" || thisChar == "\t" ? this.options.stutterSpace : 0));
                }
                this.setAnim(false);
                r();
            })
        }
        cut() {
            this.dom.innerText = this.dom.innerText.slice(0, -1);
            return this.dom.innerText.length;
        }
        async startLoop() {
            this.workId = TypeIt.random(1000000, 10000000);
            let workId = this.workId;
            let currentText = 0;
            let cache = [];
            const getText = this.options.mode == "random"
                ? () => {
                    if (cache.length == 0) {
                        cache = [...this.options.text];
                    }
                    return cache.splice(TypeIt.random(0, cache.length - 1), 1)[0];
                }
                : () => this.options.text[currentText++ % this.options.text.length];
            while (this.stage != "stop" && this.workId == workId) {
                this.prepareNode();
                await this.cutAll();
                await this.type(getText());
                this.persistNode();
                this.recoverNode();
                await TypeIt.wait(this.options.lineGag);
                this.done();
                if(this.mode == "forwards") this.stage = "stop";
            }
        }
        async cutAll() {
            this.setAnim(true);
            while (this.cut() > 0) {
                await TypeIt.wait(this.options.speed);
            }
            this.setAnim(false);
            
            await TypeIt.wait(this.options.speed);
        }
    }
    window.TypeIt = TypeIt;
    TypeIt.init();
    document.querySelectorAll("[data-typeit]").forEach((dom) => {
        let text = dom.getAttribute("data-typeit");
        let speed = dom.getAttribute("data-typeit-speed");
        if (!text) text = dom.innerText;
        if (!speed) speed = 60;
        let typeit = new TypeIt(dom, {
            text, speed
        });
        typeit.start();
    });
})();
