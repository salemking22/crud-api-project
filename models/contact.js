import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    }
}, {
    timestamps: true // Optional: adds createdAt and updatedAt timestamps
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
