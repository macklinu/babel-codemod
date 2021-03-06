import getStream = require('get-stream');
import { PassThrough } from 'stream';
import run from '../../src/index';

export type CLIResult = { status: number; stdout: string; stderr: string };

export default async function runCodemodCLI(
  args: Array<string>,
  stdin: string = ''
): Promise<CLIResult> {
  let stdinStream = new PassThrough();
  let stdoutStream = new PassThrough();
  let stderrStream = new PassThrough();

  stdinStream.end(new Buffer(stdin));

  let argv = [process.argv[0], require.resolve('../../bin/codemod'), ...args];
  let status = await run(argv, stdinStream, stdoutStream, stderrStream);

  stdoutStream.end();
  stderrStream.end();

  let stdout = await getStream(stdoutStream);
  let stderr = await getStream(stderrStream);

  return { status, stdout, stderr };
}
