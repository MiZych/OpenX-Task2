//Testing correctness of used functions

var app = require('./app.cjs');

describe('Category', () => {
    let randomCategory = new app.Category('clothing', 500);
    test('creating a new Category object', () => {
        expect(randomCategory.name).toBe('clothing');
        expect(randomCategory.value).toBe(500);
    });
    test('is the new object instance of Category', () => {
        expect(randomCategory instanceof app.Category).toBeTruthy();
    });
});

describe('productCategories', () => {
    let categories = app.productCategories([
        {id: 1, category: 'men"s clothing', price: 200}, 
        {id: 2, category: 'men"s clothing', price: 300}, 
        {id: 3, category: 'electronics', price: 200}]);
    test('creating new category key', () => {
        expect(categories['men"s clothing']).toBeTruthy();
        expect(categories['electronics']).toBeTruthy();
    });
    test('creating new object Category for each category', () => {
        expect(categories['men"s clothing'] instanceof app.Category).toBeTruthy();
        expect(categories['electronics'] instanceof app.Category).toBeTruthy();
    });
    test('checking summary price for each category', () => {
        expect(categories['men"s clothing'].value).toBe(500)    
        expect(categories['electronics'].value).toBe(200)    
    })
})

describe('priceFromProductID', () => {
    let products = [{id: 1, price: 50}, {id: 2, price: 100},{id: 3, price: 150}];
    let productArray = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
        { productId: 3, quantity: 4 }
    ];
    test('checking total price with productId and quantity', () => {
        expect(app.priceFromProductID(productArray, products)).toBe(1000);
    })
})

describe('determineUser', () => {
    let users = [
        {id: 1, name: { firstname: 'John', lastname: 'Doe' }},
        {id: 2, name: { firstname: 'Michael', lastname: 'Gratz' }},
        {id: 3, name: { firstname: 'Anna', lastname: 'Strass' }}
        ]
    test('checking correctness of fullname', () => {
        expect(app.determineUser({userId: 1}, users)).toBe('John Doe');
        expect(app.determineUser({userId: 2}, users)).toBe('Michael Gratz');
        expect(app.determineUser({userId: 3}, users)).toBe('Anna Strass');
    })
})

describe('getDistanceBeetweenGeoCoordinates', () => {
    test('correctness of distance between two points according to Wolfram Alpha', () => {
        expect(app.getDistanceBeetweenGeoCoordinates(59.3293371, 13.4877472, 59.3225525, 13.4619422)).toBeCloseTo(1.652, 1);
    })
})