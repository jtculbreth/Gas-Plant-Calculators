
function amineCalc(){
  
  document.getElementById("amine_output").innerHTML="";


  //Declare input values
  let amine_type = document.getElementById("amine_type").value;  
  let conc = document.getElementById("conc").value;
  let flowrate = document.getElementById("flowrate").value;
  let amine_conc = document.getElementById("amine_conc").value;
  
  //Declare divs
  const amineDiv = document.getElementById("amine_type");
  const concDiv = document.getElementById("conc");
  const flowrateDiv = document.getElementById("flowrate"); 
  const amine_concDiv = document.getElementById("amine_conc");

  //Reset Error Styling
  amineDiv.style.cssText = 'background-color:white';
  concDiv.style.cssText = 'background-color:white';
  flowrateDiv.style.cssText = 'background-color:white';
  amine_concDiv.style.cssText = 'background-color:white';
  
  //Declare variables
  var agp; 
  var solv_duty; 
  var flow_mmscfd;
  var flow_scfm;
  var circ_rate;
  var heat_req;
  var errors = [];

  //Option 2
  var agpmma;
  var max_conc;
  var pad;
  var pamw;
  var asd;
  var flow_magm;
  var raf;
  var mags;
  var conc_high = false;

  
  //Solvent Lookup -- Option One edited out
  if (amine_type == 'DEA'){
  	//agp = 7.1;
    solv_duty = 920;  

    agpmma = 0.5;
    pad = 68.101803;
    max_conc = 40;
    pamw = 105.14;
  }
  else if (amine_type == 'DGA'){
  	//agp = 6;
    solv_duty = 1200;

    agpmma = 0.315;
    pad = 65.937564;
    max_conc = 60;
    pamw = 105.14;
  }
  
  else if (amine_type == 'MDEA'){
  	//agp = 5.25;
    solv_duty = 850;

    agpmma = 0.4;
    pad = 64.977066
    max_conc = 65;
    pamw = 119.16;
  }
  
  else if (amine_type == "MEA") {
  	//agp = 3.7;
    solv_duty = 1100;  

    agpmma = 0.365;
    pad = 63.486423;
    max_conc = 25;
    pamw = 61.08;
  }

  //Check for Errors
  else{
  	errors.push("Please select an Amine Solution Type");
    amineDiv.style.cssText = 'background-color: #ffb6b3';
  }
  
  if (flowrate <=0 || flowrate == null){
    errors.push("Please enter a valid Flowrate");
    flowrateDiv.style.cssText = 'background-color: #ffb6b3';
  }
  
  if (conc <= 0 || conc > 100 || conc == null){
    errors.push("Please enter a valid CO2 concentration value");
    concDiv.style.cssText = 'background-color: #ffb6b3';
  }
  if (amine_conc == null || amine_conc <= 0 || amine_conc>100){
      errors.push("Please enter a valid Amine Concentration Value");
      amine_concDiv.style.cssText = 'background-color: #ffb6b3';
  }

  //If errors, list error messages. 
  if(errors.length>0){
    var feasible = true;
    
    if (amine_conc > max_conc){
        errors.unshift("The selected amine concentration may not be feasible.");
        feasible = false;
    }
    for (let i=0; i < errors.length; i++){
      var error_div = document.createElement('div');
      error_div.classList.add("error");  
      error_div.innerHTML = errors[i];
      if(!feasible){
        error_div.style.cssText = 'color:red';
        feasible = true;
      }
      document.getElementById("amine_output").append(error_div);
      }
    }
  //Otherwise, calculate and display results
  else{
    var error_div = document.createElement('div');
    error_div.style.cssText = 'color:red';
    error_div.classList.add("error");
    if (conc>50){
      error_div.append("The input CO2 concentration is relatively high.  Please reach out to us with your application so we can optimize for your specific feed situation!");
      concDiv.style.cssText = 'background-color: #ffb6b3';
      //conc_high = true;
    }
    if (amine_conc > max_conc){
    	error_div.innerHTML+="<br/><br/>The selected amine concentration may not be feasible.<br/>";
      amine_concDiv.style.cssText = 'background-color: #ffb6b3';
    }
    flow_mmscfd = flowrate*conc/100;
    //flow_scfm = flow_mmscfd*1000000/24/60;

    asd = pad*amine_conc/100+62.37*(1-amine_conc/100);
    flow_magm = flow_mmscfd*1000000/24/60/379.4;
    raf = flow_magm/agpmma;
    mags = asd*amine_conc/100/pamw/7.4805; 

    circ_rate = raf/mags;
    heat_req = solv_duty*circ_rate/1000000*60;


    //circ_rate = flow_scfm/agp;
    //heat_req = circ_rate*solv_duty/1000000*60;

    circ_rate = circ_rate.toFixed(1);
    heat_req = heat_req.toFixed(1);

    document.getElementById("amine_output").innerHTML="<h3>Required Amine Circ Rate: "+circ_rate+" USGPM Amine Soln</h3><h3>Reboiler Duty: "+heat_req+" MMBTU/hr</h3><br/>";
    document.getElementById("amine_output").prepend(error_div);
    
  }
}

// © John Culbreth 2021
