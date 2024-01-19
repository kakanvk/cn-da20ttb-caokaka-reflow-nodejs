const Background = require('../models/background');
const mongoose = require('mongoose');

const getAllBackgrounds = async (req, res) => {
    try {
        const backgrounds = await Background.find();
        res.json(backgrounds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBackgroundById = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm background trong cơ sở dữ liệu theo id
        const background = await Background.findById(id);

        if (!background) {
            return res.status(404).json({ message: 'Background not found' });
        }

        res.json(background);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createBackground = async (req, res) => {
    const { name, image, premium_only } = req.body;

    try {
        const newBackground = new Background({
            name,
            image,
            premium_only,
        });

        await newBackground.save();

        res.status(201).json({ message: 'Background created successfully', background: newBackground });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateBackgroundById = async (req, res) => {
    const { id } = req.params;
    const { name, image, premium_only } = req.body;

    try {
        const updatedBackground = await Background.findByIdAndUpdate(
            id,
            { name, image, premium_only },
            { new: true }
        );

        if (!updatedBackground) {
            return res.status(404).json({ message: 'Background not found' });
        }

        res.json({ message: 'Background updated successfully', background: updatedBackground });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteBackgroundsByIds = async (req, res) => {
    try {
        const { backgroundIds } = req.body;

        if (!Array.isArray(backgroundIds) || backgroundIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid background IDs format' });
        }

        const deletedBackgrounds = await Background.deleteMany({ _id: { $in: backgroundIds } });

        if (deletedBackgrounds.deletedCount === 0) {
            return res.status(404).json({ message: 'No backgrounds found with the given IDs' });
        }

        res.json({ message: 'Backgrounds deleted successfully', deletedBackgrounds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllBackgrounds,
    getBackgroundById,
    createBackground,
    updateBackgroundById,
    deleteBackgroundsByIds
};