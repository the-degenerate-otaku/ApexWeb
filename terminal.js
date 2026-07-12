const Terminal = (function () {

    function launch() {
        const container = document.createElement('div');
        container.className = 'terminal';

        const output = document.createElement('div');
        output.className = 'term-output';

        const inputRow = document.createElement('div');
        inputRow.className = 'term-input-row';

        const prompt = document.createElement('span');
        prompt.className = 'term-prompt';

        const input = document.createElement('input');
        input.className = 'term-input';
        input.type = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;

        inputRow.appendChild(prompt);
        inputRow.appendChild(input);
        container.appendChild(output);
        container.appendChild(inputRow);

        let currentFolderId = 'root';
        const history = [];
        let historyIndex = -1;

        function updatePrompt() {
            prompt.textContent = (VFS.getPath(currentFolderId) || '/') + ' $';
        }

        function printLine(text) {
            const line = document.createElement('div');
            line.className = 'term-line';
            line.textContent = text;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }

        function runCommand(raw) {
            const trimmed = raw.trim();
            if (!trimmed) return;

            printLine(prompt.textContent + ' ' + trimmed);
            history.push(trimmed);
            historyIndex = history.length;

            const result = ShellCommands.run(trimmed, currentFolderId);
            if (result.clear) {
                output.innerHTML = '';
            } else if (result.output) {
                printLine(result.output);
            }
            if (result.newFolderId) currentFolderId = result.newFolderId;
            updatePrompt();
        }

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                runCommand(input.value);
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex -= 1;
                    input.value = history[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < history.length - 1) {
                    historyIndex += 1;
                    input.value = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    input.value = '';
                }
                e.preventDefault();
            }
        });

        container.addEventListener('click', () => input.focus());

        updatePrompt();
        printLine('ApexWeb Terminal - type help for commands');

        WindowManager.openWindow({
            title: 'Terminal',
            content: container,
            width: 520,
            height: 340
        });

        setTimeout(() => input.focus(), 250);
    }

    return { launch };
})();