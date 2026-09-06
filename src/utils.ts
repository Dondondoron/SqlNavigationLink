
import * as crypto from 'crypto';
import * as path from "path";

export function getSafeFileNameForPath(inputPath: string): string {
    // 1. Normalize slashes and resolve to an absolute path if needed
    const resolvedPath = path.resolve(inputPath);

    const sanitized = resolvedPath
        .replace(/[:/\\*?"<>|]/g, '_')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_');

    const hash = crypto.createHash('md5').update(resolvedPath).digest('hex').substring(0, 8);

    const ext = path.extname(resolvedPath) || '.json';

    const cleanName = sanitized.replace(/^_+|_+$/g, '');

    return `${cleanName}_${hash}${ext}`;
}