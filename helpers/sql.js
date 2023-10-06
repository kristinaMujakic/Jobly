const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** 
  *This is a function to partially update User or Company data.
  * 
  * A "partial update" means that only the provided fields will be updated.
  *
  * dataToUpdate - object containing the data to be updated.
  *     Example: { firstName: 'Aliya', age: 32 }.
  *
  * jsToSql - object providing a mapping of js object keys to SQL column names.
  *    Example: { firstName: 'first_name', age: 'user_age' 
  *
  * Returns {
  *          setCols: string containing the SQL set clause,
  *          values: array of values corresponding to the SQL parameters.
  *          }
  *
  * Throws BadRequestError if the data object is emmpty
  **/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
