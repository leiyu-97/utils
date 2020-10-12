import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { deepFlatten } from './array';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export async function walk(dir:string): Promise<Array<string>> {
  const list = await readdir(dir);
  const tasks = list.map(async (file) => {
    file = path.resolve(dir, file);
    const fileStat = await stat(file);
    if (fileStat && fileStat.isDirectory()) {
      return walk(file);
    }
    return file;
  });
  return Promise.all(tasks).then(deepFlatten);
}
