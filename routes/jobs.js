"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");

const Job = require("../models/job");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");


const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * job should be {title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post('/', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    }
    catch (e) {
        return next(e);
    }
});

/** GET /  =>
 *   { jobs: [ { title, salary, equity, companyHandle }, ...] }
 *
 * Can filter on provided search filters:
 * - title: (will find case-insensitive, partial matches)
 * - minSalary
 * - hasEquity 
 *
 * Authorization required: none
 */

router.get('/', async function (req, res, next) {
    const { title, minSalary, hasEquity } = req.query;
    try {
        let jobs;

        if (!title && !minSalary && !hasEquity) {
            jobs = await Job.findAll();
            return res.json({ jobs });
        } else {
            jobs = await Job.filter(title, minSalary, hasEquity);
            return res.json({ jobs });
        }
    } catch (e) {
        return next(e);
    }
});

/** GET /[jobId] => { job }
 *
 * Returns { id, title, salary, equity, company }
 *   where company is { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[handle] { fld1, fld2, ... } => { job }
 *
 * Patches company data.
 *
 * fields can be: {title, salary, equity}
 *
 * Returns { title, salary, equity, companyHandle }
 *
 * Authorization required: login
 */

router.patch('/:id', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    }
    catch (e) {
        return next(e);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete('/:id', ensureAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    }
    catch (e) {
        return next(e);
    }
});


module.exports = router;