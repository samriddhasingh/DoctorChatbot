
var symptomss = ['itching', 'skin rash', 'nodal skin eruptions',
'continuous sneezing', 'shivering', 'chills', 'joint pain',
'stomach pain', 'acidity', 'ulcers on tongue', 'muscle wasting',
'vomiting', 'burning micturition', 'spotting urination', 'fatigue',
'weight gain', 'anxiety', 'cold hands and feets', 'mood swings',
'weight loss', 'restlessness', 'lethargy', 'patches in throat',
'irregular sugar level', 'cough', 'high fever', 'sunken eyes',
'breathlessness', 'sweating', 'dehydration', 'indigestion',
'headache', 'yellowish skin', 'dark urine', 'nausea',
'loss of appetite', 'pain behind the eyes', 'back pain',
'constipation', 'abdominal pain', 'diarrhoea', 'mild fever',
'yellow urine', 'yellowing of eyes', 'acute liver failure',
'fluid overload', 'swelling of stomach', 'swelled lymph nodes',
'malaise', 'blurred and distorted vision', 'phlegm',
'throat irritation', 'redness of eyes', 'sinus pressure',
'runny nose', 'congestion', 'chest pain', 'weakness in limbs',
'fast heart rate', 'pain during bowel movements',
'pain in anal region', 'bloody stool', 'irritation in anus',
'neck pain', 'dizziness', 'cramps', 'bruising', 'obesity',
'swollen legs', 'swollen blood vessels', 'puffy face and eyes',
'enlarged thyroid', 'brittle nails', 'swollen extremeties',
'excessive hunger', 'extra marital contacts',
'drying and tingling lips', 'slurred speech', 'knee pain',
'hip joint pain', 'muscle weakness', 'stiff neck',
'swelling joints', 'movement stiffness', 'spinning movements',
'loss of balance', 'unsteadiness', 'weakness of one body side',
'loss of smell', 'bladder discomfort', 'foul smell ofurine',
'continuous feel of urine', 'passage of gases', 'internal itching',
'toxic look (typhos)', 'depression', 'irritability', 'muscle pain',
'altered sensorium', 'red spots over body', 'belly pain',
'abnormal menstruation', 'dischromic patches',
'watering from eyes', 'increased appetite', 'polyuria',
'family history', 'mucoid sputum', 'rusty sputum',
'lack of concentration', 'visual disturbances',
'receiving blood transfusion', 'receiving unsterile injections',
'coma', 'stomach bleeding', 'distention of abdomen',
'history of alcohol consumption', 'blood in sputum',
'prominent veins on calf', 'palpitations', 'painful walking',
'pus filled pimples', 'blackheads', 'scurring', 'skin peeling',
'silver like dusting', 'small dents in nails',
'inflammatory nails', 'blister', 'red sore around nose',
'yellow crust ooze', 'prognosis']

var queue = [];
var userid='';
userid=document.getElementById('hidden-name').innerHTML

console.log(userid)

let bot = new RiveScript({debug:true});
const brains = [
  '/static/brain.rive',
  '/static/chat.rive'

];
console.log(symptomss)

bot.loadFile(brains).then(botReady).catch(botNotReady);


var reply1,reply2,reply3,message;
const message_container = document.querySelector('.messages');

const form = document.querySelector('form');

const input_box = document.querySelector('input');

form.addEventListener('submit', (e) => {
 e.preventDefault();
 selfReply(input_box.value);
 input_box.value = '';
 

});
function botReply(message){
  var chk = 0;
 if(message=="yes"){
   message='fill the form according to symptoms <iframe width="280" height="300" src="form.html"></iframe>';
 }
 if(message=="appointment"){
   message='Please fill the form for the appointment';
  window.open('http://127.0.0.1:8000/recommendation', '_blank');
 }
 else if(message=="disease"){
  
  message='You might have this';
  }
  else if(message=="notsufficientdisease"){
  
    message='Please try to enter at least four symptoms you have been suffering from in order to accurately predict disease';
    }
  else if(message=="symptoms"){

    message='Lets focus on symptoms'
  }
  else if (message=="fullsymptoms"){
    message='Your symptoms are submitted please type submit my symptoms for prediction of your disease'
  }
  else if (message=="type it"){
    message='Symptoms Noted. Do you have more symptoms than type it'
  }
  else if (message=="rule"){
    message=" To know available symptoms that you can input please type available symptoms \n "
  }
  else if (message=="ml"){
    chk = 1;
    $.ajax({
      type: 'GET',
      url: '/create/',
      data:{'queue[]': queue},
      success:function(data){
        console.log(message);
        message=data['disease'];
        text1='Thanks, after analysing the information you have given us, The system predicts that you may be suffering from ';
        description=data['description'];
        reply2=data['precaution1'];
        reply3=data['precaution2'];
       
       
        text3='Please note this is not a diagnosis. Always visit the doctor if you are in doubt or if your symptoms get worse or dont improve. If you want to book an appointment with doctor please type book an appointment?';

        preventiontext = 'Prevention of disease is important. Please follow the following steps:';
        message_container.innerHTML += `<div class="mess"><div class="abc"><i class="fa fa-user-md" aria-hidden="true"></i></div><div class="bot">${text1}<strong>${message}</strong></div></div>`;
        message_container.innerHTML += `<div class="mess"><div class="abc"><i class="fa fa-user-md" aria-hidden="true"></i></div><div class="bot">${description}</div></div>`;
        message_container.innerHTML += `<div class="mess"><div class="abc"><i class="fa fa-user-md" aria-hidden="true"></i></div><div class="bot">${preventiontext}<li>${reply2}</li><li>${reply3}</li><div>${text3}</div></div></div>`;
      }
    });
    while (queue.length) { 
      queue.pop(); 
  }
  }
  else if (message=="names"){
    message="Aren't you "+ userid;
  }
  else if (message=="appointment"){
    message='<iframe height="500px" width="100%" frameBorder="0" src="http://127.0.0.1:5000/login/home/bookticket"></iframe>\n'
  }
  

if(chk == 0){
  message_container.innerHTML += `<div class="mess"><div class="abc"><i class="fa fa-user-md" aria-hidden="true"></i></div><div class="bot">${message} </div></div>`;;
}

 location.href = '#edge';
}

function selfReply(message){
  message_container.innerHTML += `<div class="self">${message}</div> `;
 bot.reply("local-user", message).then(function(reply) {
  if(reply=='symptoms'){
    symptomss.forEach(element =>{
      if (message==element){
       
        if (queue.length<=7){
          queue.push(element);
          reply='type it'
          console.log(queue);
          
        }
        if (queue.length==7){
          reply='fullsymptoms';
        }
        

      }
    });
    
    
  }
  if (reply=='oks'){
    reply='appointment';
  }
  
  if (reply=='end'){
    if (queue.length>=3){
      reply='ml';
     
    }
 
    else{
      reply='notsufficient';
    }
  }
 botReply(reply);
 });
}
function botReady(){

 
 bot.sortReplies();
 botReply('Hello, Welcome '+userid+' to Disease prediction system How are you feeling today? ');

}
function botNotReady(err){
  bot.sortReplies();
  botReply('Hello, Welcome '+userid+' to Disease prediction system How are you feeling today? ');
  
}