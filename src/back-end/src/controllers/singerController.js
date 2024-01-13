const Singer = require('../models/singer');
const mongoose = require('mongoose');

// Hàm để lấy toàn bộ danh sách singer
const getAllSingers = async (req, res) => {
    try {
        const singers = await Singer.find();
        res.json(singers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hàm để tạo mới singer (yêu cầu quyền admin)
const createSinger = async (req, res) => {
    const { name, image } = req.body;

    try {
        // Tạo mới singer
        const newSinger = new Singer({
            name,
            image,
        });

        // Lưu vào database
        await newSinger.save();

        res.status(201).json({ message: 'Singer created successfully', singer: newSinger });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hàm để lấy thông tin singer dựa trên id
const getSingerById = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm singer trong database theo id
        const singer = await Singer.findById(id);

        if (!singer) {
            return res.status(404).json({ message: 'Singer not found' });
        }

        res.json(singer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hàm để cập nhật thông tin singer dựa trên id (yêu cầu quyền admin)
const updateSingerById = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;

    try {
        // Tìm và cập nhật singer trong database theo id
        const updatedSinger = await Singer.findByIdAndUpdate(
            id,
            { name, image },
            { new: true } // Trả về singer đã được cập nhật
        );

        if (!updatedSinger) {
            return res.status(404).json({ message: 'Singer not found' });
        }

        res.json({ message: 'Singer updated successfully', singer: updatedSinger });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hàm để xoá singer dựa trên id (yêu cầu quyền admin)
const deleteSingerById = async (req, res) => {
    const { id } = req.params;

    try {
        // Xoá singer trong database theo id
        const deletedSinger = await Singer.findByIdAndDelete(id);

        if (!deletedSinger) {
            return res.status(404).json({ message: 'Singer not found' });
        }

        res.json({ message: 'Singer deleted successfully', singer: deletedSinger });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSingersByIds = async (req, res) => {
    try {
        // Lấy danh sách id singer từ request body
        const { singerIds } = req.body;

        // Kiểm tra xem singerIds có đúng định dạng hay không
        if (!Array.isArray(singerIds) || singerIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid singer IDs format' });
        }

        // Xoá các singer có id nằm trong danh sách singerIds
        const deletedSingers = await Singer.deleteMany({ _id: { $in: singerIds } });

        if (deletedSingers.deletedCount === 0) {
            return res.status(404).json({ message: 'No singers found with the given IDs' });
        }

        res.json({ message: 'Singers deleted successfully', deletedSingers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllSingers,
    createSinger,
    getSingerById,
    updateSingerById,
    deleteSingerById,
    deleteSingersByIds
};
