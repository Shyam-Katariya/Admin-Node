export const successCommonWithData = (res, code, data, message) => {
    res.status(code).send({
        status: code,
        type: 'Success',
        data: data,
        message: message,
    });
};

export const successCommon = (res, code, message) => {
    res.status(code).send({
        status: code,
        type: 'Success',
        message: message,
    });
};