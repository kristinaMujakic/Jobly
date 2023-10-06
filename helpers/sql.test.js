const { sqlForPartialUpdate } = require('./sql');

describe('sqlForPartialUpdate', () => {
    test('Should generate SQL set clause and values for a partial update', () => {
        const dataToUpdate = {
            firstName: 'Aliya',
            age: 32
        };

        const jsToSql = {
            firstName: 'first_name',
            age: 'user_age'
        };

        const expectedSetCols = '"first_name"=$1, "user_age"=$2';
        const expectedValues = ['Aliya', 32];

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result.setCols).toBe(expectedSetCols);
        expect(result.values).toEqual(expectedValues);
    });
});
