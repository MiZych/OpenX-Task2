var users, products;

fetch('https://fakestoreapi.com/users') .then(function(response){
    if (response.ok){
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then(function (data){
    users = data;
    findFurthestDistance(data);
    return fetch('https://fakestoreapi.com/products')
}).then (function (response){
    if (response.ok){
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then (function (productsData){
    products = productsData;
    productCategories(productsData);
    return fetch('https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07')
.then(function (response) {
    if (response.ok){
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then (function (cartsData){
    findHighestCart(cartsData);

})
}).catch(function (error){
    console.warn(error);
})

//Creating an object that specifies unique category with summary value of all products in category
function Category(name, value){
    this.name = name;
    this.value = value;
};

//Creating a literal object for all product categories
function productCategories(products){
        let categories = {};
        //If the category doesn't exist yet it creates new Category and assign the value.
        //If the category exist it only adds a price to current value
        products.forEach(element => {
        if (!categories[element.category]){
            categories[element.category] = new Category(element.category, element.price);
        } else {
            categories[element.category].value += element.price;
        }
        });
        return categories;
};

//Function to determine a whole price from Product ID and Quantity
function priceFromProductID(productArray, products){
    let totalPrice = 0;
    //Iterates for every product in cart and checks the productID variable in all products Array (if it is equal the loop will add the price * quantity to totalPrice and break to save memory)
    productArray.forEach(element => {
        for (let i = 0; i < products.length; i++){
            if (element.productId === products[i].id){
                totalPrice += (products[i].price * element.quantity)
                break;
            };
        };
    })
    return totalPrice;
};

//Function to determine whose user has a highestValue cart
//Function will check userID if it is equal and return whole name: firstname and lastname
function determineUser(cart, users){
    for (let i = 0; i < users.length; i++){
        if (users[i].id === cart.userId){
            return `${users[i].name.firstname} ${users[i].name.lastname}`;
        }
    }
}

//Function to find highest value cart from all carts.
//Iterates for every cart and check the totalPrice if it higher than already highest value (default is 0) then it replaces value with a new highest value and then determines which user has this cart
function findHighestCart(carts){
    let highestCart = {name: null, value: 0};

    carts.forEach(element => {
        let totalPrice = priceFromProductID(element.products, products);
        if (totalPrice > highestCart.value){
            highestCart.value = totalPrice;
            highestCart.name = determineUser(element, users);
        };
    })
    return highestCart;
};


//To calculate distance between coordinates we must use math expression using heversine formula according to Wikipedia
//Output in kilometres
function getDistanceBeetweenGeoCoordinates(lat1, lon1, lat2, lon2){
    let R = 6371;
    let deltaLat = (lat2 - lat1) * Math.PI/180;
    let deltaLon = (lon2 - lon1) * Math.PI/180;
    let radianLatitude1 = lat1 * Math.PI/180;
    let radianLatitude2 = lat2 * Math.PI/180;

    let a  = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(radianLatitude1) * Math.cos(radianLatitude2) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let distance = R * c
    return distance;
}

//Function to find furthest distance between two users, we are checking every possibilities for every user and return the highest value 
function findFurthestDistance(users){
    let furthestDistance = {user1: null, user2: null, distance: 0};
    let userDetails = [];
    users.forEach(element => {
        userDetails.push({name: element.name.firstname + ' ' + element.name.lastname, geolocation: {lat: Number(element.address.geolocation.lat), long: Number(element.address.geolocation.long)}})
    })

    for (let i = 0; i < userDetails.length; i++){
        for (let j = i + 1; j < userDetails.length; j++){
            let distance = getDistanceBeetweenGeoCoordinates(userDetails[i].geolocation.lat, userDetails[i].geolocation.long, userDetails[j].geolocation.lat, userDetails[j].geolocation.long);
            if (distance > furthestDistance.distance){
                furthestDistance.distance = distance;
                furthestDistance.user1 = userDetails[i].name;
                furthestDistance.user2 = userDetails[j].name;
            }
        }
    }
    return furthestDistance;
}

module.exports = {};
module.exports.Category = Category;
module.exports.productCategories = productCategories;
module.exports.priceFromProductID = priceFromProductID;
module.exports.determineUser = determineUser;
module.exports.getDistanceBeetweenGeoCoordinates = getDistanceBeetweenGeoCoordinates;

