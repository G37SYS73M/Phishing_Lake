const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Static method to create the default user
UserSchema.statics.createDefaultUser = async function () {
    const defaultUsername = "admin";
    const defaultPassword = "admin123";

    // Check if the default user already exists
    const existingUser = await this.findOne({ username: defaultUsername });
    if (existingUser) {
        console.log("Default user already exists.");
        return;
    }

    // Create the default user
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const defaultUser = new this({ username: defaultUsername, password: hashedPassword });

    try {
        await defaultUser.save();
        console.log(`Default user created: Username: ${defaultUsername}, Password: ${defaultPassword}`);
    } catch (error) {
        console.error("Error creating default user:", error);
    }
};

module.exports = mongoose.model("User", UserSchema);