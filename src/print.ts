const chalk = require('chalk');
var format = require('string-format')

export function clientClear() {
    console.log(chalk.green('[Client] ' + '--'));
}

export function client(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.green('[Client] ' + format(message, optionalParams)));
}

export function clientError(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.greenBright.bgBlackBright('[Client] ' + format(message, optionalParams)));
}

export function serverClear() {
    console.log(chalk.yellow('[Server] ' + '--'));
}

export function server(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.yellow('[Server] ' + format(message, optionalParams)));
}

export function serverError(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.yellowBright.bgBlackBright('[Server] ' + format(message, optionalParams)));
}

export function convertClear() {
    console.log(chalk.blue('[Bridge] ' + '--'));
}

export function convert(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.blue('[Bridge] ' + format(message, optionalParams)));
}

export function convertError(message?: any, ...optionalParams: any[]): void {
    console.log(chalk.blueBright.bgBlackBright('[Bridge] ' + format(message, optionalParams)));
}