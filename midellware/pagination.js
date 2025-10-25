// function withPagination(Model) {
//     Model.findAllPagined = async (query = {}, { page = 1, limit = 10 } = {}) => {
//         const offset = (page -1) * limit;
//         const { count, rows } = await Model.findAndCountAll({
//             ...query,
//             limit,
//             offset
//         });

//         return {
//             totalItems: count,
//             totalPages: Math.ceil(count / limit),
//             currentPage: page,
//             data: rows
//         };
//     };

//     return Model
// }

// module.exports = withPagination;

module.exports = (req, res, next) => {
    const limit = parseInt(req.query.limit) || parseInt(process.env.DEFAULT_LIMIT);

    const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE);
    const offset = (page -1) * limit;
    const sort = req.query.sort || 'id';
    const order = (req.query.order) || 'DESC'.toUpperCase();

    req.pagination = {page, limit, offset, sort, order};

    next();
}