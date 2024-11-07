import { Schema, model } from 'mongoose';

// User schema
const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            unique: [true, 'Email already exits'],
            require: true,
        },
        password: {
            type: String,
            require: true,
            minLength: 5,
        },
        isActive: {
            type: Boolean,
            require: true,
        },
        role: {
            type: String,
            require: true,
        },
        file: {
            type: String,
        },
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    { timestamps: true }
);
const User = model('users', userSchema);

export default User;
