const calculatePagination = (page, limit, total) => {
    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(total / limit);

    return {
        skip,
        totalPages,
    };
};

module.exports = calculatePagination;