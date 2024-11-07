import { existsSync, mkdirSync } from "node:fs";
import { resolve, join } from 'path';
import { addColors, format, createLogger, transports } from 'winston';

// Define custom colors for log levels
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};
addColors(colors);

// Define a custom format to handle errors properly
const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

// Ensure that the 'logs' directory exists
const logDir = resolve(process.cwd(), 'logs');
if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
}

// Function to create a custom logger with dynamic filenames
export const createLog = (logName, logDirectory = '') => {
    const currentDate = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '_');
    const logFilename = `${logName}_${currentDate}.log`;

    const directoryPath = resolve(process.cwd(), 'logs', logDirectory);

    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
    }

    return createLogger({
        level: 'info',
        format: format.combine(
            enumerateErrorFormat(),
            format.colorize(colors),
            format.splat(),
            format.printf(({ level, message }) => {
                const timestamp = new Date().toISOString();
                return `[${timestamp}] ${level}: ${message}`;
            })
        ),
        transports: [
            new transports.Console({
                stderrLevels: ['info', 'error', 'log', 'debug'],
            }),
            new transports.File({
                filename: join(directoryPath, logFilename),
                level: 'error',
            }),
            new transports.File({
                filename: join(directoryPath, logFilename),
                level: 'info',
            }),
        ],
    });
};
