let data=[];

let puzzleSize=3;
let imageWidth;
let imageHeight;
let imageURL = "https://preview.redd.it/m42sdvjwqv2e1.jpg?width=736&format=pjpg&auto=webp&s=56380e368362fcd9a23f37fd06cbfe7d577753e6";


let timer;
let timeCount;

let cellWidth=Math.floor(imageWidth/puzzleSize);
let cellHeight=Math.floor(imageHeight/puzzleSize);

var img = new Image();
img.src = imageURL;

let table = document.querySelector("table");
let timeSpan = document.querySelector("time");

img.onload = function(){
  imageWidth = img.height;
  imageHeight = img.width;  

  if(imageWidth>=window.innerWidth) {
    imageWidth/=1.6;
    imageHeight/=1.6;
  }
  if(imageHeight>=window.innerHeight) {
    imageWidth/=1.6;
    imageHeight/=1.6;
  }


  cellWidth=Math.floor(imageWidth/puzzleSize)
  cellHeight=Math.floor(imageHeight/puzzleSize)

  console.log(imageWidth, imageHeight);
  
  console.log(cellWidth, cellHeight);
  init()
}

function init() {
  timeCount=0;
  timer=setInterval(()=>{
    let timeInMin = Math.floor(timeCount/60);
    let timeInSec=Math.floor(timeCount-timeInMin*60);
    timeSpan.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg><span>' + (timeInMin<=9?"0":"")+timeInMin +":"+(timeInSec<=9?"0":"") + timeInSec + "</span>";
    timeCount++;
  }, 1000);

  randomize(0, puzzleSize*puzzleSize -2);
  display()
}

function display() {
  table.innerHTML=null;

  for(i=0;i<puzzleSize;i++) {
    let tr = document.createElement("tr");
    for(j=0;j<puzzleSize;j++) {
      let td = document.createElement("td");
      if(data[i][j]!=-1) {
      td.style.backgroundImage = `url(${imageURL})`;
      td.style.width = `${cellWidth}px`;
      td.style.height = `${cellHeight}px`;

      const position = data[i][j];
      const x = Math.floor((position % puzzleSize) * cellWidth);
      const y = Math.floor(Math.floor(position / puzzleSize) * cellHeight);
      td.style.backgroundPosition = `${-x}px ${-y}px`;
      td.style.backgroundSize = imageWidth + "px " + imageHeight + "px";
      // td.innerHTML = data[i][j] + " " + x + "x" + y;
    }
      td.onclick = (()=>{
        const x=i;
        const y=j;

        return ()=>{
          move(x, y)
        }
      })();
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function move(i, j) {    
  for(a=i-1;a<=i+1;a++) {
    for(b=j-1;b<=j+1;b++) {
      if(a<0||a>=puzzleSize || b<0 || b>=puzzleSize || ((a==i-1||a==i+1 ) && (b==j-1 || b==j+1))) {
      continue;
      }
      
      if(data[a][b]==-1) {
        data[a][b]=data[i][j];
        data[i][j]=-1;
        display();
        move();
        check();
      }
    }
  }
}

function check() {
  let complete = true;
  data.forEach((arr, i)=>{
    arr.forEach((el, j)=>{
      if(data[i][j]!=(i*3)+j && data[puzzleSize-1][puzzleSize-1]!=-1) {
        complete=false;
      }
    })
  })
  
  if(complete) {
    alert("Solved!")
  }
}

function randomize(min, max) {
  const uniqueValues = [];
  for (let i = min; i <= max; i++) {
    uniqueValues.push(i);
  }

  // Shuffle the array using Fisher-Yates shuffle
  for (let i = uniqueValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
     let temp=uniqueValues[i];
     uniqueValues[i]=uniqueValues[j];
     uniqueValues[j]=temp;
  }

  console.log(uniqueValues);
  
  for(i=0;i<puzzleSize;i++)  {
    let row=[];
    for(j=0;j<puzzleSize;j++) {
      row.push(uniqueValues.pop());
    }
    data.push(row);
  }
  data[puzzleSize-1][puzzleSize-1]=-1;
  console.log(data);

  data=[[0, 1, 2],[3, 4, 5], [6, 7, -1]];
  
}