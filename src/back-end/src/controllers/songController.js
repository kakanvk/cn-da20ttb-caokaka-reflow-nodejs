const Song = require('../models/song');
const mongoose = require('mongoose');

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find()
            .populate('categoryId', 'name') // Lấy tên của thể loại
            .populate('singerId', 'name');  // Lấy tên của ca sĩ

        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getSongById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        const song = await Song.findById(id)
            .populate('categoryId', 'name') // Lấy tên của thể loại
            .populate('singerId', 'name');  // Lấy tên của ca sĩ

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createSong = async (req, res) => {
    const { title, sections, categoryId, singerId, image } = req.body;

    try {
        const newSong = new Song({
            title,
            sections,
            categoryId,
            singerId,
            image,
        });

        await newSong.save();

        res.status(201).json({ message: 'Song created successfully', song: newSong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSongsByIds = async (req, res) => {
    try {
        const { songIds } = req.body;

        if (!Array.isArray(songIds) || songIds.some(id => !id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ message: 'Invalid song IDs format' });
        }

        const songs = await Song.find({ _id: { $in: songIds } });

        if (songs.length !== songIds.length) {
            return res.status(404).json({ message: 'One or more songs not found' });
        }

        await Song.deleteMany({ _id: { $in: songIds } });

        res.json({ message: 'Songs deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateSongById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Cập nhật thông tin bài hát
        // Dựa vào req.body để cập nhật các trường mong muốn

        if (req.body.title) {
            song.title = req.body.title;
        }

        if (req.body.sections) {
            song.sections = req.body.sections;
        }

        if (req.body.categoryId) {
            song.categoryId = req.body.categoryId;
        }

        if (req.body.singerId) {
            song.singerId = req.body.singerId;
        }

        if (req.body.image) {
            song.image = req.body.image;
        }

        await song.save();

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addSectionToSong = async (req, res) => {
    try {
        const { id: songId } = req.params;
        const { name, lyrics } = req.body;

        if (!songId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Tìm section có order lớn nhất và tăng lên 1 để gán cho section mới
        const maxOrderSection = song.sections.reduce((max, section) => (section.order > max ? section.order : max), 0);
        const order = maxOrderSection + 1;

        const newSection = { name, lyrics, order };
        song.sections.push(newSection);

        await song.save();

        res.status(201).json({ message: 'Section added successfully', song });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateSections = async (req, res) => {
    try {
        // Lấy id của bài hát từ đường dẫn
        const { id } = req.params;

        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        // Lấy thông tin bài hát từ cơ sở dữ liệu
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Lấy danh sách sections mới từ request body
        const newSections = req.body.sections;

        // Kiểm tra xem newSections có đúng định dạng hay không
        if (!Array.isArray(newSections) || newSections.some(section => !section.name || !section.lyrics || !Number.isInteger(section.order))) {
            return res.status(400).json({ message: 'Invalid sections format' });
        }

        // Tạo một đối tượng Map để lưu trữ order mới của từng section dựa trên id của section
        const orderMap = new Map(newSections.map(section => [section._id, section.order]));

        // Cập nhật sections cũ dựa trên order mới
        song.sections.forEach(section => {
            const newOrder = orderMap.get(section._id);
            if (newOrder !== undefined) {
                section.order = newOrder;
            }
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await song.save();

        // Trả về thông báo thành công
        res.json({ message: 'Sections updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSectionsByIds = async (req, res) => {
    try {
        // Lấy id của bài hát từ đường dẫn
        const { id } = req.params;

        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        // Lấy thông tin bài hát từ cơ sở dữ liệu
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Lấy danh sách id của sections cần xoá từ request body
        const sectionIdsToDelete = req.body.sectionIds;

        // Kiểm tra xem sectionIdsToDelete có đúng định dạng hay không
        if (!Array.isArray(sectionIdsToDelete) || sectionIdsToDelete.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid section IDs format' });
        }

        // Kiểm tra xem các sections có tồn tại trong bài hát hay không
        const sectionsInSong = song.sections.map(section => section._id.toString());
        const sectionsToDelete = sectionIdsToDelete.filter(id => sectionsInSong.includes(id));

        if (sectionsToDelete.length !== sectionIdsToDelete.length) {
            return res.status(404).json({ message: 'One or more sections not found in the song' });
        }

        // Xoá sections có id nằm trong danh sách sectionIdsToDelete
        await Song.updateOne({ _id: id }, { $pull: { sections: { _id: { $in: sectionsToDelete } } } });

        // Trả về thông báo thành công
        res.json({ message: 'Sections deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateSectionById = async (req, res) => {
    try {
        // Lấy id của bài hát và section từ đường dẫn
        const { songId, sectionId } = req.params;

        // Kiểm tra xem cả hai id có đúng định dạng MongoDB hay không
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({ message: 'Invalid song or section ID format' });
        }

        // Lấy thông tin bài hát từ cơ sở dữ liệu
        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Lấy thông tin section từ mảng sections của bài hát
        const sectionToUpdate = song.sections.find(section => section._id.toString() === sectionId);

        if (!sectionToUpdate) {
            return res.status(404).json({ message: 'Section not found in the song' });
        }

        // Cập nhật thông tin của section dựa vào req.body
        if (req.body.name) {
            sectionToUpdate.name = req.body.name;
        }

        if (req.body.lyrics) {
            sectionToUpdate.lyrics = req.body.lyrics;
        }

        // Lưu thay đổi vào cơ sở dữ liệu
        await song.save();

        // Trả về thông báo thành công
        res.json({ message: 'Section updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getSectionById = async (req, res) => {
    try {
        // Lấy id của bài hát và section từ đường dẫn
        const { songId, sectionId } = req.params;

        // Kiểm tra xem cả hai id có đúng định dạng MongoDB hay không
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({ message: 'Invalid song or section ID format' });
        }

        // Lấy thông tin bài hát từ cơ sở dữ liệu
        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Lấy thông tin section từ mảng sections của bài hát
        const section = song.sections.find(section => section._id.toString() === sectionId);

        if (!section) {
            return res.status(404).json({ message: 'Section not found in the song' });
        }

        // Trả về thông tin của section
        res.json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    deleteSongsByIds,
    updateSongById,
    addSectionToSong,
    updateSections,
    deleteSectionsByIds,
    updateSectionById,
    getSectionById
};

