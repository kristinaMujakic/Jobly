'use strict';

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Job {

    /** Create a job (from data), update db, return new job data.
     *
     * data should be { title, salary, equity, companyHandle }
     *
     * Returns {id, title, salary, equity, companyHandle }
     *
     * Throws BadRequestError if job is already in database.
     */

    static async create({ title, salary, equity, companyHandle }) {

        const result = await db.query(
            `INSERT INTO jobs (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
            [title, salary, equity, companyHandle]
        );

        const job = result.rows[0];

        return job;
    }

    /** Find all jobs.
     *
     * Returns [{ title, salary, equity, companyHandle }, ...]
     */

    static async findAll() {
        const jobsRes = await db.query(
            `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
            FROM jobs
            ORDER BY title`
        );

        return jobsRes.rows;
    }

    /** Filter the jobs based on optional filtering criteria.
     *
     * title: partial matches, case insensitive
     * minSalary: filter to jobs with at least that salary
     * hasEquity: if true, filter to jobs that provide a non-zero amount of equity
     *  if false or not included in the filtering, list all jobs regardless of equity
     *
     * Returns [{ title, salary, equity, companyHandle }, ...]
     */

    static async filter(title, minSalary, hasEquity) {
        let query =
            `SELECT title,
              salary,
              equity,
              company_handle AS companyHandle
            FROM jobs
            WHERE 1 = 1`;

        const params = [];

        if (title) {
            query += ` AND title ILIKE $${params.push(`%${title}%`)}`;
        }

        if (minSalary !== undefined) {
            query += ` AND salary >= $${params.push(minSalary)}`;
        }

        if (hasEquity) {
            query += ` AND equity > 0`;
        }

        query += ' ORDER BY title';

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return 'No results found.';
        } else {
            return result.rows;
        }
    }

    /** Given a job id, return data about job.
     *
     * Returns {id, title, salary, equity, companyHandle, company }
     *
     *where company is { handle, name, description, numEmployees, logoUrl }
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const jobRes = await db.query(
            `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
            [id]
        );

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`No job found with id: ${id}`);

        const companiesRes = await db.query(
            `SELECT handle,
              name,
              description,
              num_employees AS "numEmployees",
              logo_url AS "logoUrl"
            FROM companies
            WHERE handle = $1`,
            [job.companyHandle]
        );

        delete job.companyHandle;
        job.company = companiesRes.rows[0];

        return job;
    }

    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all  the
     * fields; this only changes provided ones.
     *   
     * Data can include: {title, salary, equity} 
     *   
     * Returns {title, salary, equity, companyHandle} 
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data, {});

        const idVarIdx = values.length + 1;

        const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = $${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;

        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job found with id: ${id}`);

        return job;
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE 
       FROM jobs 
       WHERE id = $1 
       RETURNING id`,
            [id]
        );

        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job found with id: ${id}`);
    }
}

module.exports = Job;
