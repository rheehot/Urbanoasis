// ------ 1. Regular Notice -------- //
// Edit 버튼들 
var Edit_Buttons = document.querySelectorAll('.ml-edit')
// Edit_Cancel 버튼들
var Edit_Cancels = document.querySelectorAll('.ml-cancel')
// 현재 내용 
var Edit_Contents = document.querySelectorAll('.ml-auto')
// 입력할 input
var Edit_Inputs = document.querySelectorAll('.ml-input')
// Input Save 버튼
var Edit_Saves  = document.querySelectorAll('.ml-save')

for(var i = 0 ; i < Edit_Buttons.length ; i++){

    let CurrentRow = i;
    let Content    = Edit_Contents[i]
    let Input      = Edit_Inputs[i]
    let Btn        = Edit_Buttons[i]
    let Cancel     = Edit_Cancels[i]
    let Save       = Edit_Saves[i]

    // Edit 버튼을 클릭하면 , Edit_cancel 과 Textarea는 나타나게 하고, 기존의 Text 내용은 숨긴다 
    Btn.addEventListener('click', function(){
        Input.value            = Content.innerHTML
        Input.style.display    = "block"
        Cancel.style.display   = "block"
        Save.style.display     = "block"
        Btn.style.display      = "none"
        Content.style.display  = "none"
    })
    
    // Edit-Cancel 버튼을 누르면, 원상복귀시킨다
    Cancel.addEventListener('click', function(){
        
        Save.style.display    = "none"
        Input.style.display   = "none"
        Cancel.style.display  = "none"
        Btn.style.display     = "block"
        Content.style.display = "block"
        
    })
    
    // Edit-save 버튼을 누르면 textarea 값을 text value로 바꿔주고, 동시에 DB에 해당내용을 저장한다
    Save.addEventListener('click', function(){
        
        Input.value            = Input.value.replace(/(?:\r\n|\r|\n)/g, '<br />')
        console.log(Input.value)

        // 1. Input 내용을 DB에 저장해주기 위해 post 내용을 날린다 
        var xhr = new XMLHttpRequest()

        //해당 내용과, 어떤 내용의 글이 수정되는지 확인하기 위해, 각 요일에 대해서 row num을 부여할 것이고, 그것을 위해 i 라는 인자를 전달한다 
        const requestData = `input=${Input.value}&num=${CurrentRow}`

        xhr.onload = function(){
            
            console.log("post to edit server success")

            if(xhr.status === 200){

                console.log("Save success arrvied in Client")

                // 2. Input 내용을 Content 내용으로 바꿔준다.
                Content.innerHTML   = Input.value
        
                // 3. 해당 내용들을 다시 원상태 visual로 돌려놓는다 
                Save.style.display    = "none"
                Input.style.display   = "none"
                Cancel.style.display  = "none"
                Btn.style.display     = "block"
                Content.style.display = "block"

                // 4. 저장 완료라는 alert를 띄운다
                alert("Checklist Edit Complete")
                
                event.preventDefault();
                return ;

            }else{
                alert("Something wrong going on")
                return false;
            }
        }

        xhr.open('POST','/notice/ChecklistEdit', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(requestData);

        return ;
    })

}


//---------- 2. Daily Notice ----------- //
var AddDailyBtn = document.getElementById("DailyAdd")
var Modal = document.querySelector('.modal')
var BackTotal = document.querySelector('.about-heading')
const Overlay = document.querySelector(".modal__overlay")

// 배경을 선택하면 upload 모델 창이 닫힌다 , 배경 blur도 사라진다
const closeModal = () =>{
    Modal.classList.add("hidden")
    BackTotal.style.filter = "blur(0)"

}

Overlay.addEventListener("click",closeModal)
console.log(Overlay)

// add notice 버튼을 클릭하면 modal 창이 열린다 
AddDailyBtn.addEventListener('click', function(){
    console.log("hello")
    console.log(Modal)
    console.log(BackTotal)
    // 1. modal 창을 보여준다
    Modal.classList.remove('hidden')
    
    // 2. 배경은 blur 처리한다 
    BackTotal.style.filter = "blur(5px)"

})



// ---- 3. Video / Image Preview ---- // 

// Video Upload BTN
const inpVideo = document.getElementById('inpVideo')

// Image Upload BTN
const inpImage = document.getElementById('inpImage')

// Image Preview 창 
const previewContainer = document.getElementById("image-preview");

// image 업로드 되면 나타나는 창 
const previewImage = previewContainer.querySelector(".image-preview__image")

// image 업로드 전에 나타나는 기본 text 
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")

// Video Preview 창
const VideoContainer = document.querySelector(".video-preview");

// Video appear 창
var _VIDEO = document.querySelector('#video-element');


// Video Upload 경우
inpVideo.addEventListener("change", function(){

    if(['video/mp4'].indexOf(inpVideo.files[0].type) == -1){
            alert("Error: Only Mp4 format allowed")
            return;
        }
        
    // upload 된 구체적 data type
    const file = this.files[0];
    const fileReader = new FileReader();
    
    if( file ){

        fileReader.readAsDataURL(file)
        fileReader.onload = function(){

        
        _VIDEO.src = fileReader.result
        _VIDEO.style.display = "block"
        // Video 창만 뜨우고, text, imb는 src를 빼고 감춘다
        previewDefaultText.style.display = "none"
        previewImage.src = ""
        previewImage.style.display = "none"

        }

    }else{
            // null을 함으로써 css 설정 default값을 따르도록 할 것이다 
            previewDefaultText.style.display = null;
            previewImage.style.display = null;
            previewImage.setAttribute("src","")
        }
    })

// Image 업로드 경우
inpImage.addEventListener("change", function(){

    if(['image/gif', 'image/jpeg', 'image/png'].indexOf(inpImage.files[0].type) == -1){
            alert("Error: Only gif,jpeg,png format allowed")
            return;
        }
        
    // upload 된 구체적 data type
    const file = this.files[0];
    const fileReader = new FileReader();
    
    if( file ){

        fileReader.readAsDataURL(file)
        fileReader.onload = function(){

        previewImage.src = fileReader.result
        previewImage.style.display = "block"

        // image 창만 뜨우고, text, video는 src를 빼고 감춘다
        previewDefaultText.style.display = "none"
        _VIDEO.src = ""
        _VIDEO.style.display = "none"
    }
    

    }else{
            // null을 함으로써 css 설정 default값을 따르도록 할 것이다 
            previewDefaultText.style.display = null;
            previewImage.style.display = null;
            previewImage.setAttribute("src","")
        }
    })



// ----- 4. Modal Upload to DB ------ //

// 현재 시간
let today = new Date(); 
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜
let CurrentTime = year + '/' + month + '/' + date
console.log("Current Time : ", CurrentTime)

const SubBtn = document.getElementById('submit-btn')

const inpForm = document.getElementById('upload_form');

const inpText = document.getElementById("inpText");

const inpDate = CurrentTime;



inpForm.onsubmit = function(){


    var formData = new FormData();
    var xhr = new XMLHttpRequest()

    // video, image 둘중 하나도 입력하지 않으면 alert 띄우고  redirect
    if(  inpVideo.files[0] === undefined &&  inpImage.files[0] === undefined ){
        alert("Put in your video or Image")
        return ;
    }

    console.log(inpImage.files[0])
    
    formData.append('upload', inpDate)
    formData.append('upload', inpText.value)
    formData.append('upload', inpVideo.files[0])
    formData.append('upload', inpImage.files[0])

    const form = {
        Video : inpVideo.files[0],
        Img   : inpImage.files[0],
        Text  : inpText.value,
        Date  : inpDate
    }

    // response 처리하기
    xhr.onload = function(){

          if(xhr.status === 200){
              console.log("Server responded appropriately with 200 status")
              // 동영상 url 링크를 받는다
              console.log(xhr.responseText)
              alert("Notice Upload Success")
              // make_video()
              window.location.href = "/notice"
          }
          else if( xhr.status === 400){
              alert("Notice Upload Failed")
              event.preventDefault()
              return;
          }
      }

      xhr.open('POST','/notice', true);
      xhr.send(formData);

    event.preventDefault();
}

// ----- 5. Daily Notice Edit ------ //
const EditBtn = document.getElementsByClassName("notice-edit")
// EditBtn.addEventListener("click", function(){
//     event.preventDefault();
// })