class APIfeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    let queryStr = { ...this.queryStr };
    ["sort", "page", "limit", "fields"].forEach((el) => delete queryStr[el]);
    this.query.find(queryStr);
    return this;
  }
  sort() {
    let queryStr = this.queryStr.sort;
    if (!queryStr) return this;
    queryStr = this.#queryStrTransformation(queryStr);
    this.query.sort(queryStr);
    return this;
  }
  fields() {
    let queryStr = this.queryStr.fields;
    if (!queryStr) return this;
    queryStr = this.#queryStrTransformation(queryStr);
    this.query.select(queryStr);
    return this;
  }
  async page() {
    let { page, limit } = this.queryStr;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
  #queryStrTransformation(string) {
    return JSON.parse(JSON.stringify(string).split(",").join(" "));
  }
}
module.exports = APIfeatures;
