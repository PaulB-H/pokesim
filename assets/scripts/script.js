// jQuery
var computerTeam = [];
var playerTeam = [];
var activePlayerPokemon;
var activeComputerPokemon;
const genericCarouselID = "playerPkmn";
var computerActiveIndex = 0;
var numActivePlayerPokemon = 6;

function randomPokemon(teamName) {
    var pokeID = Math.ceil(Math.random() * 151);
    var queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`
    var isShiny = (1 == Math.ceil(Math.random() * 8192));
    var frontSpriteUrl;
    var backSpriteUrl;

    $.get(queryURL).then(function (response) {
        // Totally unnecessary but now we can have shinies in battle
        if (isShiny && response.sprites.back_shiny && response.sprites.front_shiny) {
            frontSpriteUrl = response.sprites.front_shiny
            backSpriteUrl = response.sprites.back_shiny
            console.log("We have a shiny!");
        } else {
            frontSpriteUrl = response.sprites.front_default
            backSpriteUrl = response.sprites.back_default
        }

        let pkmnName = response.name;

        var pokeData = {
            name: pkmnName[0].toUpperCase() + pkmnName.slice(1),
            hp: response.stats[5].base_stat,
            hpCurrent: response.stats[5].base_stat,
            attack: response.stats[4].base_stat,
            defense: response.stats[3].base_stat,
            status: "ready",
            spriteFront: frontSpriteUrl,
            spriteBack: backSpriteUrl
        }
        teamName.push(pokeData);
    });
};

function generateTeam(team) {
    for (var i = 0; i < 6; i++) {
        randomPokemon(team);
    }
};

generateTeam(playerTeam);
generateTeam(computerTeam);

console.log("Player Team:", playerTeam);
console.log("Opponent Team:", computerTeam);

$(document).ready(function(){
    
    $("#startGame").click(function () {
    // Set background image equal to pokeball sprite from API call
    // $.ajax({
    //     url: "https://pokeapi.co/api/v2/item/poke-ball/",
    //     method: "GET"
    // }).then(function(response) {
    //     var bgImage = response.sprites.default;
    //     $("body").css('background-image', `url( ${bgImage} )` );
    // });

    
        // Get that landing page outta here
        $("#landingPage").addClass("slideOut");
        $("#pkBallCircleBack").addClass("slideOutBottom");
        $("#startGame").addClass("slideOutBottom");
        setTimeout(function () {
            $('.carousel').carousel();
            $.each($(".carousel-item"), function(i) {
                let carouselID = '#' + genericCarouselID+i;
                console.log(carouselID);
                $(carouselID).attr("src", playerTeam[i].spriteFront);
                
            })
            
            // Show the first Pokemon selection and displays their stats under the Carousel
            $("#landingPage").css("display", "none");
            $("#teamSelection").css("visibility", "visible").addClass("fadeIn");
            activePlayerPokemon = playerTeam[0];
            activeComputerPokemon = computerTeam[0];
            $('.card-content').html(`
            <span class="card-title">${activePlayerPokemon.name}</span>
            <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
            <p>ATK: ${activePlayerPokemon.attack}</p>
            <p>DEF: ${activePlayerPokemon.defense}</p>
            `);
        }, 700);
    })
});
