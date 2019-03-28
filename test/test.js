/**
 * Created by andrey on 27.03.2019.
 */
let expect = chai.expect;

describe('Testing binding functionality', function () {
    //Very basic tests included
    it('DOM loaded', function () {
        header.render('.content')
    });

    it('should return true if Title and inputs values are identical', function () {
        expect(document.querySelector('h1').innerHTML).eql(document.querySelector('input').value)
    });
});
