// image slider for coffee
let slides = document.querySelector('.carousel-slides').children;
let nextSlide = document.querySelector('#nextBtn');
let prevSlide = document.querySelector('#prevBtn');
let index = 0;

let totalSlides = slides.length;

nextSlide.addEventListener('click', ()=>{
    console.log("next")
    next("next")
})

prevSlide.addEventListener('click', ()=>{
    console.log("prev")
    next("next")
})

function next(direction){

    // next btn
    if( direction == "next"){
        index++;
        if(index == totalSlides){
            index = 0;
        }
    }

    // prev btn
    else{
        if( index == 0){
            index = totalSlides - 1;
        }else{
            index--;
        }
    }

    for(let i = 0 ; i < slides.length ; i++){
        slides[i].classList.remove("active");
    }
    
    slides[index].classList.add("active")

}

// image slider for wash
let slides_wash = document.querySelector('.carousel-slides_wash').children;
let wash_screen = document.querySelector('.carousel-slides_wash')
let index_wash = 0;

let totalSlides_wash = slides_wash.length;

wash_screen.addEventListener('click', ()=>{
    console.log("next")
    next_wash("next")
})

function next_wash(direction){

    // next btn
    if( direction == "next"){
        index_wash++;
        if(index_wash == totalSlides_wash){
            index_wash = 0;
        }
    }

    for(let i = 0 ; i < slides_wash.length ; i++){
        slides_wash[i].classList.remove("active");
    }
    
    slides_wash[index_wash].classList.add("active")

}