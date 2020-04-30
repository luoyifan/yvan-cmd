import { transform } from "./transform";
import * as path from 'path'
import { spawn, exec } from 'child_process'
import * as print from './print'

function printHelp() {
    console.log(`yvan-cmd Help
    command [serverPath] [uiSrcPath]`);
}

function normPath(p: string) {
    if (p.startsWith(".")) {
        return path.join(__dirname, p);
    }
    return path.join(p);
}

function tsc(name: string, folder: string, printClear: Function, print: Function, printError: Function): void {
    const tscCmd = spawn('tsc', ['-w'], { shell: true, cwd: folder });
    tscCmd.stdout.on('data', (data) => {
        if (data[0] === 27 && data[1] === 99) {
            // 清屏...
            printClear();
            return;
        }

        // 正常输出
        print(data.toString().trim());
    });

    tscCmd.stderr.on('data', (data) => {
        // 异常输出
        printError(data);
    });

    tscCmd.on('close', (code) => {
        // 进程关闭
        print(`TSC process exited with code ${code}`);
    });
}

function main() {
    if (process.argv.length != 4) {
        printHelp();
        return;
    }

    const serverPath = normPath(process.argv[2]);
    const uiPath = normPath(process.argv[3]);
    console.log(`Start Sync
serverSrcPath: ${serverPath}
uiSrcPath:     ${uiPath}
================================ `);

    transform(serverPath, uiPath);
    tsc('ServerJS', serverPath, print.serverClear, print.server, print.serverError);
    tsc('UI-Src', uiPath, print.clientClear, print.client, print.clientError);
    // print.clientClear();
    // print.client('client info {} {} {}', 'a', 'b', 1);
    // print.clientError('clientt error');

    // print.serverClear();
    // print.server('server info');
    // print.serverError('server error');

    // print.convertClear();
    // print.convert('convert into');
    // print.convertError('convert error');

    // exec('tsc -w', { cwd: serverPath }, (err, stdout, stderr) => {
    //     console.error('error:' + err.message);
    //     console.error(stdout);
    //     console.log(stdout);
    // })
}

main();