import { Parser } from './parser/index.js';
import { Command } from 'commander';
const program = new Command();
program.name('count occurrence').description('CLI to run occurrence.').version('0.0.1');
program.requiredOption('-t, --token <token>', 'github personal token');
program.parse();
const token = program.opts().token;
const parser = new Parser(token);
const start = Date.now();
console.log(`start at ${start} )`);
const result = await parser.parseTree('main');
console.log('Final Result');
console.log(JSON.stringify(result));
const end = Date.now();
console.log(`end at ${end} took ${(end - start) / 1000} s`);
//# sourceMappingURL=main.js.map