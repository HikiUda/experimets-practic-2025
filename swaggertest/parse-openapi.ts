/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { parse } from 'jsr:@std/yaml';
// import { readTextFile } from 'jsr:@std/fs';

// Вариант 1: Синхронное чтение
// const yamlContent = await Deno.readTextFile('./swagger.yaml');
// const swaggerData = parse(yamlContent);
// console.log(swaggerData.paths);

// Вариант 2: Через std/fs (асинхронно)
// const content = await readTextFile('./swagger.yaml');
// const data = parse(content);
// console.log(data.paths['/api'].get.summary);
