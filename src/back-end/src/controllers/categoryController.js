const Category = require('../models/category');

const createCategory = async (req, res) => {
    const { name, image } = req.body;

    try {
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, image });
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm category trong database theo id
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateCategoryById = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;

    try {
        // Tìm category trong database theo id
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update thông tin của category
        if(name){
            category.name = name;
        }

        if(image){
            category.image = image;
        }

        // Lưu category sau khi đã được cập nhật
        await category.save();

        res.json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm category trong database theo id và xoá nó
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteCategoriesByIds = async (req, res) => {
    const { ids } = req.body;

    try {
        // Kiểm tra xem có danh sách ids được gửi lên hay không
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing category ids' });
        }

        // Tìm và xoá nhiều categories trong database theo ids
        const deletedCategories = await Category.deleteMany({ _id: { $in: ids } });

        if (deletedCategories.deletedCount === 0) {
            return res.status(404).json({ message: 'Categories not found' });
        }

        res.json({ message: 'Categories deleted successfully', categories: deletedCategories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    deleteCategoriesByIds
};
