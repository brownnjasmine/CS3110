
//List of cats
const cats = document.querySelectorAll('.Cat');

//Each cat has drag functionality applied
cats.forEach(cat => {cat.addEventListener('dragstart', drag)});

//All destinations in which cats can be dropped
const locations = document.querySelectorAll('.Destination');

//Each location must 1) prevent the default of not being droppable and 2)place the data of the item being dragged within its div
locations.forEach(location => {
    location.addEventListener('drop', drop)
    location.addEventListener('dragover', place)
    location.addEventListener('dragover', hoveredOver)
    location.addEventListener('dragleave', notHoveredOver)});

//Same things for the locations above, makes it so you can put cats back where they started at the top "cat bar"
const catBar = document.querySelector('.Cats');
catBar.addEventListener('drop', drop);
catBar.addEventListener('dragover', place);
catBar.addEventListener('dragover', hoveredOver);
catBar.addEventListener('dragleave', notHoveredOver);

//Button to add or remove a friend!
var buttonStatus = false;
const button = document.querySelector('button');
button.addEventListener("click", buttonClicked);



function place(ev){
    //Since Document Objects are, by default, not places in which you can drop things into, I have to call prevent default so they can become active places in which i can drop data
    ev.preventDefault();
};


//Moves the data from one div to another
function drop(ev)
{
    const data = ev.dataTransfer.getData('text/plain');
    ev.target.appendChild(document.getElementById(data));
};

//Gets the data of the cat being dragged
function drag(ev){
    ev.dataTransfer.setData('text/plain', ev.target.id);
};

//Changes color of box being hovered over when something is being dragged
function hoveredOver(ev){
    ev.preventDefault();
    ev.target.classList.add('hover-over');
}

//Changes color of box back to normal when nothing is hovering over it
function notHoveredOver(ev){
    ev.preventDefault();
    ev.target.classList.remove('hover-over');
}

//Adds or removes a new friend to the cat roster!
function buttonClicked(ev){
    if(buttonStatus)
    {
        //Removes Guy Furry from the DOM
        buttonStatus= false;
        document.getElementById("Guy_Furry").removeEventListener('dragstart', drag);
        catBar.removeChild(specialGuest);
        alert("Bye Guy Furry! Come back soon!");
    }
    else{
        //Adds Guy Furry to the DOM as an image, gives him the ability to be dragged around like the other cats
        buttonStatus = true;
        specialGuest = document.createElement("img");
        specialGuest.src = "Cat_Sprites/Guy_Furry.png";
        specialGuest.id="Guy_Furry";
        specialGuest.classList.add('Cat');
       
        catBar.appendChild(specialGuest);
        document.getElementById("Guy_Furry").addEventListener('dragstart', drag);
        alert("A wild Guy Furry has appeared! He says hi :3");
    }
}