/**
 * Configuration module for encryption settings used in password hashing.
 * This module exports an object containing the necessary parameters for
 * cryptographic functions, specifically for password hashing and
 * verification processes.
 */
export const encryption = {
    /**
     * Number of iterations to use for the PBKDF2 hashing algorithm.
     * Higher values increase security but also increase computation time.
     * Recommended to use a value that balances security and performance.
     */
    ITERATIONS: 310000,

    /**
     * The length of the derived key in bytes.
     * This value determines the size of the output hash.
     * A longer key length provides better security.
     */
    KEY_LENGTH: 32,

    /**
     * The hashing algorithm to be used.
     * 'sha256' is a widely used algorithm that provides a good balance of
     * speed and security.
     */
    ALGORITHM: 'sha256',
};
