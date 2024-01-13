const Fuse = require('fuse.js');
const unidecode = require('unidecode');
const Singer = require('../models/singer');
const Song = require('../models/song');

const search = async (req, res) => {
    try {
        // Lấy từ khóa tìm kiếm từ query params
        const keyword = req.query.keyword;

        // Kiểm tra xem keyword có tồn tại hay không
        if (!keyword) {
            return res.status(400).json({ message: 'Missing search keyword' });
        }

        // Lấy danh sách ca sĩ
        const singers = await Singer.find({}, 'name');

        // Lấy danh sách bài hát
        const songs = await Song.find({}, 'title singerId');

        // Gộp danh sách ca sĩ và bài hát thành một mảng chung
        const data = singers.map(singer => ({ type: 'singer', item: singer.toObject() }))
            .concat(songs.map(song => ({ type: 'song', item: song.toObject() })));

        // Tạo đối tượng Fuse với các tùy chọn tùy chỉnh
        const fuseOptions = {
            includeScore: true,
            keys: ['item.name', 'item.title'], // Sử dụng đúng đường dẫn để truy cập thông tin từ các item
            ignoreLocation: true,
            threshold: 0.5,
            ignoreCase: true,
            shouldSort: true,
        };

        const fuse = new Fuse(data, fuseOptions);

        // Thực hiện tìm kiếm với từ khóa
        const result = fuse.search(keyword);

        // Chia kết quả thành 2 mảng: singers và songs
        const singersResult = result.filter(item => item.item.type === 'singer');
        const songsResult = result.filter(item => item.item.type === 'song');

        // Sắp xếp mỗi mảng theo score
        singersResult.sort((a, b) => a.score - b.score);
        songsResult.sort((a, b) => a.score - b.score);

        // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của từng bài hát và ca sĩ
        const detailedSingers = await Singer.find({ _id: { $in: singersResult.map(item => item.item.item._id) } });

        // Lấy thông tin chi tiết của bài hát, bao gồm cả thông tin của ca sĩ
        const detailedSongs = await Song.find({ _id: { $in: songsResult.map(item => item.item.item._id) } })
            .populate('singerId', 'name'); // Lấy thông tin của ca sĩ

        // Trả về kết quả tìm kiếm với thông tin chi tiết
        res.json({
            singers: detailedSingers,
            songs: detailedSongs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { search };