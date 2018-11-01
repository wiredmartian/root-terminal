
const Terminal = (function () {
    const Terminal = function (HTMLElementId, Options) {
        this.element = HTMLElementId;
        this.options = {};
        _defaults();
        _getOptions(Options);
    };

    function _defaults() {
        /** HTML Element Selector */
        if (typeof this.element === "string") {
            let _htmlElement = document.querySelector(this.element);
            console.log(_htmlElement);
            if (typeof _htmlElement !== "undefined") {

                let isInput = _htmlElement.localName;
                if (isInput === "input") {
                    Terminal.element = _htmlElement;
                    /** attach listener on Enter */
                    Terminal.element.addEventListener("keydown", function (e) {
                        handleUserInput(e)
                    });
                }
            }
        }

    }
    function handleUserInput(e) {
        if (e.key === "Enter" && e.keyCode === 13) {
            let input = Terminal.element.value;

            if (typeof input !== "undefined" && input !== "") {
                let response = _processTerminalInput(input);
                createNewLine(response);
            }
        }
    }
    
    function createHTMLElement() {
        let newelement = document.createElement("span");
        let node = `<span class=\"prefix\"> ${Terminal.options.root} </span>`;
        newelement.textContent = Terminal.options.root;
        newelement.className = "prefix"
        createNewLine();
    }

    function createNewLine(res) {
        console.log(`createNewLine(): ${res}`);
        let lines = Array.from(document.querySelectorAll('.line'));
        let last_el = lines[lines.length - 1];
        let new_node = last_el.cloneNode(true);
        let new_input = new_node.querySelector('input.commandInput');
        if (new_input) {
            /** TODO: this line is too much dependent on the DOM */
            new_input.parentElement.firstElementChild.innerText = Terminal.options.root;
            new_input.value = res;
            new_input.autofocus = true;
        }
        last_el.after(new_node);
        killElementAfterCloning(last_el);
    }

    function killElementAfterCloning(el) {
        let old_el = el.querySelector('input');
        old_el.id = "";
        old_el.disabled = true;
    }

    function _getOptions(opts) {
        let options = new Object({
            root: "root@ubuntu",
            guest: "guest@ubuntu",
            into: ["Leave as null", "if you don't want bio"],
            bg_color: "green"
        });
        Object.assign(options, opts);
        Terminal.options = options;
    }

    function _getTerminalCommands() {
        let data = (window.commands.length > 0) ? window.commands : [];
        let cmd = [];
        data.forEach((value) => {
            cmd.push(Array.from(Object.keys(value)));
        });
        return cmd;
    }
    function _processTerminalInput(input = "dob") {
        let arr = _getTerminalCommands();
        let result = "";
        if (arr.length !== 0 && typeof(input) !== undefined) {
            result =`\"${ input }\" is not recognized as an internal or external command`;
            for (let index in arr) {
                if (arr[index].toString().includes(input.toLocaleLowerCase())) {
                    result = Object.values(window.commands[index])[0];
                    break;
                }
            }
        }
        return result;
    }
    Terminal(".commandInput", {root: "root@user", bg_color: "red"});
    return Terminal;
})();

