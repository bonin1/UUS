exports.bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    return buffer.toString('base64');
};

exports.base64ToBuffer = (base64String) => {
    if (!base64String) return null;
    return Buffer.from(base64String, 'base64');
};
