function paginatedResponse (rows, count, page = parseInt(process.env.DEFAULT_PAGE), limit = parseInt(process.env.DEFAULT_LIMIT)) {
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows
  }
}

module.exports = paginatedResponse;
