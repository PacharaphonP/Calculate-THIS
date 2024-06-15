let methods = "+-×÷";
let isLastInputNumber = false;
let lastMethod = "";
let instruction = [];
let order = [];
let level = 1;
let goal=0;
let numArr = [0,0,0,0,0,0,0,0,0,0];
let numUse = [0,0,0,0,0,0,0,0,0,0];
let warning = $(".warning");
let numLeft=level+2;

function calculate(){
    let ans = calculatePostFix(makePostFix(instruction));
    instruction = ans;
    $("#result").text(ans.toString());
    if(numLeft===0 && goal===ans[0]) nextLevel();
    console.log(ans);
}
//calculator
$(".number").on("click",function() {
    let curNum = parseInt($(this).text());
    let lastNum = instruction[instruction.length-1];
    if(numArr[curNum]!=numUse[curNum]){
        if(!isLastInputNumber) {
            isLastInputNumber=true;
            instruction.push(curNum);
        } else {
            instruction.pop();
            instruction.push(curNum);
            numUse[lastNum]--;
            $("#n"+lastNum.toString()+" .usable").text("x"+(numArr[lastNum]-numUse[lastNum]).toString());
        }
        numUse[curNum]++;
        $("#n"+curNum.toString()+" .usable").text("x"+(numArr[curNum]-numUse[curNum]).toString());
        lastNum=curNum;
        numLeft--;
        warning.text("");
        $("#result").text(instruction.join(""));
    } else warning.text("cannot choose this number");
    console.log(instruction);
    console.log(numLeft);
});

$(".method").on("click",function() {
    if(isLastInputNumber){
        instruction.push($(this).text());
        isLastInputNumber=false;
        lastMethod=$(this).text();
    } else if(lastMethod !=""){
        instruction.pop();
        instruction.push($(this).text());
        lastMethod=$(this).text();
    }
    $("#result").text(instruction.join(""));
    warning.text("");
    console.log(instruction);
});

$("#reset").on("click",function() {
    reset();
});

$("#delete").on("click",function() {
    if(instruction.length===1) reset();
    else{
        if(isLastInputNumber){
            let curNum=instruction[instruction.length-1];
            numUse[curNum]--;
            numLeft++;
            $("#n"+curNum.toString()+" .usable").text("x"+(numArr[curNum]-numUse[curNum]).toString());
        }
        instruction.pop();
        isLastInputNumber=!isLastInputNumber;
        $("#result").text(instruction.join(""));
    }
    console.log(instruction);
});

$("#calculate").on("click",function() {
    if(isLastInputNumber && instruction!="") calculate();
});
//QoL function
function randomInt(n) {
    return Math.floor(Math.random()*n);
}

function basicCal(a,b,method) {
    let ans;
    switch (method) {
        case "+":
            ans = a+b;
            break;
        case "-":
            ans = a-b;
            break;
        case "×":
            ans = a*b;
            break;
        case "÷":
            ans = a/b;
            break;
        default:
            ans = 0;
            break;
    }
    return ans;
}

function calculatePostFix(postFix){
    let stack = [];
    for(let i=0;i<postFix.length;i++){
        if(typeof postFix[i] === "number") stack.push(postFix[i]);
        else{
            let a = basicCal(stack[stack.length-2],stack[stack.length-1],postFix[i]);
            stack.pop();
            stack.pop();
            stack.push(a);
        }
    }
    return stack;
}

function makePostFix(s){
    let postFix = [];
    let opStack = [];
    for(let i=0;i<s.length;i++){
        if(i%2===0){
            postFix.push(s[i]);
            if(i===s.length-1){
                for(let j = opStack.length-1;j>=0;j--) {
                    postFix.push(opStack[j]);
                }
            } else{
                while(opRank(opStack.slice(-1)[0])>=opRank(s[i+1])){
                    postFix.push(opStack.slice(-1)[0]);
                    opStack.pop();
                }
        }
        } else opStack.push(s[i]);
    }
    return postFix;
}

function opRank(op){
    if(op==="+" || op==="-") return 1;
    if(op==="×" || op==="÷") return 2;
}
//generate Random
function restart(){
    level = 1;
    $("#level").text(level.toString());
    reset();
    generateLevel();
}

function reset(){
    $("#result").text("");
    isLastInputNumber=false;
    lastMethod = "";
    instruction = [];
    numUse = [0,0,0,0,0,0,0,0,0,0];
    numLeft=level+2;
    renderUsable();
}

function generateLevel(){
    for(let i=0;i<level+2;i++) {
        let randomNum = randomInt(9)+1;
        numArr[randomNum]++;
        order.push(randomNum);
        if(i!=level+1){
            order.push(methods[randomInt(4)]);
        }
    }
    renderUsable();
    goal = calculatePostFix(makePostFix(order))[0];
    $("#random-number").text(goal.toString());
}

function nextLevel(){
    level++;
    $("#level").text(level.toString());
    reset();
    order=[];
    numArr = [0,0,0,0,0,0,0,0,0,0];
    generateLevel();
    console.log("new level");
}

function renderUsable(){
    for(let i=1;i<10;i++) {
        $("#n"+i.toString()+" .usable").text("x"+numArr[i].toString());
    }
}
restart();
