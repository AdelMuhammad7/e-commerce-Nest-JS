/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Query } from 'mongoose';

export class APIFeatures<T> {
  constructor(
    private mongooseQuery: Query<T[], T>,
    private queryString: any,
  ) {}
  pagination() {
    const page = Number(this.queryString.page) || 1;
    const limit = Math.min(Number(this.queryString.limit) || 10, 100);
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(this.queryString.sort);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }

    return this;
  }

  search(fields: string[]) {
    if (this.queryString.search) {
      const searchQuery = {
        $or: fields.map((field) => ({
          [field]: {
            $regex: this.queryString.search,
            // ignore Case
            $options: 'i',
          },
        })),
      };
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'limit', 'sort', 'search'];

    excludedFields.forEach((field) => delete queryObj[field]);

    this.mongooseQuery = this.mongooseQuery.find(queryObj);

    return this;
  }

  select() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.mongooseQuery = this.mongooseQuery.select(fields);
    }

    return this;
  }

  getQuery() {
    return this.mongooseQuery;
  }
}
