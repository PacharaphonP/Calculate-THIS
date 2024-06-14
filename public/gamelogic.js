let methods = "+-×÷";
let isLastInputNumber = false;
let lastMethod = "";
let instruction = [];
let lastInstruct = [];
let level = 1;
let goal;

function calculate(){
    let ans = calculatePostFix(makePostFix(instruction));
    lastInstruct=instruction;
    instruction = ans;
    $("#result").text(ans.toString());
    if(instruction[0]===goal) restart();
    console.log(ans);
}
//calculator
$(".number").on("click",function() {
    if(!isLastInputNumber) {
        isLastInputNumber=true;
        instruction.push(parseInt($(this).text()));
        $("#result").text($(this).text());
    }
    console.log(instruction);
});

$(".method").on("click",function() {
    if(isLastInputNumber){
        if(($(this).text()==="×" || $(this).text()==="÷") && (lastMethod==="+" || lastMethod==="-")){ 
            console.log("go on mate");
        } else {
            calculate();
            lastMethod=$(this).text();
        }
        
        isLastInputNumber=false;
    } else {
        instruction.pop();
    }
    instruction.push($(this).text());
    console.log(instruction);
});

$("#reset").on("click",function() {
    reset();
});

// $("#delete").on("click",function() {
//     instruction=lastInstruct;
//     if(instruction.length===1) reset();
//     else{
//         instruction.pop();
//         instruction.pop();
//         isLastInputNumber=true;
//         $("#result").text(instruction.toString()); 
//     }
//     console.log(instruction);
// });

$("#calculate").on("click",function() {
    if(isLastInputNumber && instruction!="") calculate();
});
//QoL function
function randomInt() {
    return Math.floor(Math.random()*900)+1;
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
                    console.log(opStack[j]);
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
    reset();
    goal = randomInt();
    $("#random-number").text(goal.toString());
}

function reset(){
    $("#result").text("");
    isLastInputNumber=false;
    instruction = [];
    lastInstruct = [];
}

restart();
