const { program } = require('commander');

program.version('1.0.0');

program
  .command('hello <name>')
  .description('Say hello to someone')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program.parse(process.argv);
