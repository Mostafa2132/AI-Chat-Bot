

let btn =document.getElementById("btn");

  window.onscroll = function(){
  if(scrollY >370){
    btn.style.display="flex";
  }else{
    btn.style.display="none";
  }
}

btn.onclick = function(){
  scrollTo({
    top:0,
    right:0,
    behavior:"smooth"
  })
}


const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");

const API_KEY = "AIzaSyDeRdNxHSB-2QbJ4cqZSgUPI73merYr7_k";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const showTyping = (text, textEle) => {
    const words = text.split(" ");
    let index = 0;
    const typinginterval = setInterval(() => {
        textEle.innerText += (index === 0 ? "" : " ") + words[index++];
        if (index === words.length) {
            clearInterval(typinginterval); 
        }
        window.scrollTo(0, chat_list.scrollHeight)
    }, 75);
}

const generateAPI = async (div) => {
    const text_ele = div.querySelector(".text");
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMsg }]
                }]
            })
        });

        const data = await res.json();
        let mydata = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1");  // fixed regex
        showTyping(mydata, text_ele);

    } catch (err) {
        console.log(err);
    } finally {
        div.classList.remove("loading");
    }
}

const handleOutput = (e) => {
    userMsg = document.querySelector(".msg").value;
    if (!userMsg) return;

    const html = `
        <div class="message_content flex items-center mb-10 gap-3">
            <img src="./img/user_12236621.png" class="size-[45px] self-start rounded-full" alt="">
            <p class="text-white text text-lg"></p>
        </div>
    `;
    const div = document.createElement("div");
    div.classList.add("message", "outGoing");
    div.innerHTML = html;
    div.querySelector(".text").innerHTML = userMsg;

    chat_list.appendChild(div);
    typing_form.reset();
    window.scrollTo(0, chat_list.scrollHeight)

    setTimeout(showLoading, 500);
}

typing_form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutput();
});


const copyMsg = (copy_btn) => {
    const msg = copy_btn.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(msg)
    alert(" Message copied to clipboard")

}

const showLoading = () => {
    const html = `
        <div class="message mb-[30px]">
            <div class="message_content flex items-center  gap-3">
                <img src="./img/gemini.svg" class="size-[45px] self-start rounded-full" alt="">
                <p class="text-white text whitespace-pre-wrap text-lg"></p>
                <div class="loading">
                    <div class="loading_Bar"></div>
                    <div class="loading_Bar"></div>
                    <div class="loading_Bar"></div>
                </div>
            </div>
        </div>
        <i onclick=copyMsg(this) class="fa-solid fa-clipboard text-xl mb-10  ms-10 p-0 text-white/45 cursor-pointer hover:text-white duration-[.4s]"></i>
    `;
    const div = document.createElement("div");
    div.classList.add("message", "incomming", "loading");
    div.innerHTML = html;
    chat_list.appendChild(div);
    window.scrollTo(0, chat_list.scrollHeight)

    generateAPI(div);
}


