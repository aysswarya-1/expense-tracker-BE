import cloudinary from "../uploads/cloudinary.js";
import User from "../models/User.model.js";

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pics" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        stream.end(buffer);
    });
};
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await streamUpload(req.file.buffer);
        // user.profileImageUrl = result.secure_url;
        // await User.save();
        return res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

