/**
 * Created by andrey on 27.03.2019.
 */
let expect = chai.expect;

describe('Testing binding functionality', function () {
    //Very basic tests included
    it('DOM loaded', function () {
        header.render('.content')
    });

    it('should be the same DOM element and binded value', function() {
        const bind = new Binding({
            object: {
                data: {
                    title: 'TrialReach',
                    name: 'andrey'
                }
            },
            property: "title"
        });

        let elements = document.querySelector('[data-event]');
        bind.addBinding(elements, "value", "keyup");

        elements.addEventListener('change', function() {
            expect(bind.value).eql(document.querySelector('h1').innerHTML);
        });
    });
});
