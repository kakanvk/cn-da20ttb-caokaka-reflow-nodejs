const User = require('../models/user');
const Song = require('../models/song');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Background = require('../models/background');

const getAllUsers = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Chỉ lấy danh sách người dùng nếu người dùng có quyền
        const users = await User.find();

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy id người dùng từ đường dẫn
        const userId = req.params.id;

        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin người dùng
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        // Lấy id người dùng từ đối tượng req
        const userId = req.user.id;

        // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của người dùng hiện tại
        const currentUser = await User.findById(userId).populate('selected_background');

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin người dùng
        res.json(currentUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUserById = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy id người dùng từ đường dẫn
        const userId = req.params.id;

        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật thông tin người dùng
        // Dựa vào req.body để cập nhật các trường mong muốn

        // Ví dụ: Cập nhật tên người dùng
        if (req.body.name) {
            user.name = req.body.name;
        }

        // Cập nhật email
        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.body.role) {
            user.role = req.body.role;
        }

        if (req.body.avatar) {
            user.avatar = req.body.avatar;
        }

        // Lưu các thay đổi
        await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUserById = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy id người dùng từ đường dẫn
        const userId = req.params.id;


        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Xoá người dùng khỏi cơ sở dữ liệu
        await user.deleteOne();

        // Trả về thông báo thành công
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUsersByIds = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy danh sách id người dùng từ request body
        const { userIds } = req.body;

        // Kiểm tra xem userIds có đúng định dạng hay không
        if (!Array.isArray(userIds) || userIds.some(id => !id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ message: 'Invalid user IDs format' });
        }

        // Kiểm tra xem các người dùng có tồn tại hay không
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length !== userIds.length) {
            return res.status(404).json({ message: 'One or more users not found' });
        }

        // Xoá các người dùng khỏi cơ sở dữ liệu
        await User.deleteMany({ _id: { $in: userIds } });

        // Trả về thông báo thành công
        res.json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addFavoriteSong = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ đối tượng req
        const userId = req.user.id;

        // Lấy id bài hát từ request body
        const { songId } = req.body;

        // Kiểm tra xem id bài hát có đúng định dạng MongoDB hay không
        if (!songId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra xem bài hát có tồn tại hay không
        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Kiểm tra xem bài hát đã có trong danh sách yêu thích chưa
        if (user.favorites.includes(songId)) {
            return res.status(400).json({ message: 'Song is already in favorites' });
        }

        // Thêm bài hát vào danh sách yêu thích của người dùng
        user.favorites.push(songId);

        // Lưu thay đổi
        await user.save();

        res.json({ message: 'Song added to favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFavoriteSongs = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ đối tượng req
        const userId = req.user.id;

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId).populate({
            path: 'favorites',
            populate: [
                { path: 'singerId', select: 'name' }, // Lấy tên của ca sĩ
                { path: 'categoryId', select: 'name' }, // Lấy tên của thể loại
            ],
            select: 'title singerId categoryId image',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lấy danh sách yêu thích của người dùng kèm theo thông tin của bài hát,
        // tên của ca sĩ và tên của thể loại
        const favoriteSongs = user.favorites;

        res.json(favoriteSongs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const removeFavoriteSongById = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ đối tượng req
        const userId = req.user.id;

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lấy id của bài hát cần bỏ khỏi danh sách yêu thích
        const songIdToRemove = req.params.id;

        // Kiểm tra xem id của bài hát có đúng định dạng MongoDB hay không
        if (!songIdToRemove.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid song ID format' });
        }

        // Sử dụng $pull để loại bỏ bài hát khỏi danh sách yêu thích
        user.favorites.pull(songIdToRemove);

        // Lưu thông tin người dùng sau khi loại bỏ bài hát
        await user.save();

        res.json({ message: 'Song removed from favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const removeFavoriteSongsByIds = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        const { songIds } = req.body;
        // Lấy danh sách id bài hát từ request body

        // Kiểm tra xem songIds có đúng định dạng hay không
        if (!Array.isArray(songIds) || songIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Invalid song IDs format' });
        }

        // Lấy id người dùng từ đối tượng req
        const userId = req.user.id;

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lọc bỏ những bài hát có trong danh sách yêu thích của người dùng
        user.favorites = user.favorites.filter(song => !songIds.includes(String(song)));

        // Lưu thay đổi
        await user.save();

        // Trả về thông báo thành công
        res.json({ message: 'Favorite songs removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const changeInfoCurrentUser = async (req, res) => {
    try {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy thông tin người dùng từ database
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.name) {
            currentUser.name = req.body.name;
        }

        // Cập nhật email
        if (req.body.email) {
            currentUser.email = req.body.email;
        }

        if (req.body.username) {
            currentUser.username = req.body.username;
        }

        if (req.body.password) {
            currentUser.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.body.avatar) {
            currentUser.avatar = req.body.avatar;
        }

        if (req.body.selected_background) {

            const background = await Background.findById(req.body.selected_background);

            if(currentUser.role!=="Free"){
                currentUser.selected_background = req.body.selected_background;
            } else if(!background.premium_only){
                currentUser.selected_background = req.body.selected_background;
            }

        }

        // Lưu thay đổi vào cơ sở dữ liệu
        await currentUser.save();

        // Trả về thông tin người dùng sau khi thay đổi
        res.json({ message: 'Background changed successfully', user: currentUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    updateUserById,
    deleteUserById,
    deleteUsersByIds,
    addFavoriteSong,
    getFavoriteSongs,
    removeFavoriteSongById,
    removeFavoriteSongsByIds,
    changeInfoCurrentUser,
};
