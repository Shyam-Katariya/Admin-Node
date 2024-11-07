class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}

export const commonError = (res, code, message) => { 
    res.status(code).json({
        type: 'error',
        status: code,
        message: message
    })
}