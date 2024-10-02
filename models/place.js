class Place{
    constructor(title, imageUrl, adddress, location) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.adddress = adddress;
        this.location = location; // {lat: 0.141241, lng: 12.124124}
        this.id = new Date().toString() + Math.random().toString();
    }
 }