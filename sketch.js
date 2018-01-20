var cities=[],finalPoint=5000000;
var textVal,citySize=25,populationSize=20,populationStartSize
var population=[,]
var count=0,tiltCount=0;

//Stop
var countStoper, resultStop, tiltStop;

function setup() {
	createCanvas(750,500)
	populationStartSize=populationSize
	//Stop Vars
	countStoper=50000; 
	resultStop=1000
	tiltStop=10000;
	//Generate Cities and Populations
	citiesInitialize();
	generatePopulation()

	//Start
	while(count<=countStoper && population[0].result>=resultStop && tiltCount<=tiltStop){
		crosser(70)
		mutations(30)
		erase(populationSize-populationStartSize)

		
		if(population[0].result==finalPoint)
			tiltCount++;
		else
			tiltCount=0;

		count++;
		
		if (population[0].result<finalPoint) {
			finalPoint=population[0].result
			drawMap()
			console.log(count+". iterasyon sonucu: "+population[0].result)	
		}
		
	}
	//Result
	console.log("Best Result: "+population[0].result)
	console.log("tilt Count: "+tiltCount)
	console.log("Count: "+count)
	
	
	
}

function erase(c){
	for(i=0;i<c;i++){
		roulette()
	}
}
//Functions
function drawMap(){
	background(245)
	cityPoints()
	roadDrawer()
}
function citiesInitialize(){
	
	for(var i=1;i<=citySize;i++){
		let tempCity=new city();
		tempCity.x=random(width-40)+20
		tempCity.y=random(height-40)+20
		cities.push(tempCity)
	}
}
function cityPoints(){
	for(i=0;i<citySize;i++){
		textSize(10)
		ellipse(cities[i].x,cities[i].y,20,20)
		text(textBuild(i),cities[i].x-5,cities[i].y+4)
	}
}
function textBuild(i){
	if(i<10)
			return "0"+i
		else
			return i
}
function roulette(){
	let countDelete=0;
	let total=0.0;
	let point=[];
	let totalPoint=0,currentPoint;
	let tempPopulation=[]
	for(var i=0;i<populationSize;i++){
		total += population[i].result;
	}
	for(var i=0;i<populationSize;i++){
		point[i]=total/population[i].result
		totalPoint+=point[i]
	}
	currentPoint=random(totalPoint);
	while(countDelete<populationSize && currentPoint>0){
		currentPoint-=point[populationSize-countDelete];
		countDelete++;
	}
	countDelete=populationSize-countDelete
	
	for(var i=0; i<populationSize;i++){
		if(i!=countDelete)
			tempPopulation.push(population[i])
	}
	populationSize--;
	population=tempPopulation;
}
function generatePopulation(){
	
	for(var i=0;i<populationSize;i++){
		var newGen = new genetic();
		for(var j=0;j<citySize;j++){
			newGen.gens.push(j);
		}
		randShuffle(newGen.gens)
		newGen.result=fitnessFunc(newGen.gens)
		population[i]=newGen;
	}
	population = resultSort(population)
}

function randShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function fitnessFunc(array){
	let tempResult=0
	for(var i=1;i<citySize;i++){
			tempResult+=sqrt(pow((abs(cities[array[i]].x-cities[array[i-1]].x)),2)+pow((abs(cities[array[i]].y-cities[array[i-1]].y)),2))
			
		}
		return tempResult
}

function resultSort(p){
	return p.sort(function(a, b){
    var keyA = a.result
        keyB = b.result
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
});
}

function roadDrawer(){
	for(var i=0;i<citySize-1;i++){
		line(cities[population[0].gens[i]].x,cities[population[0].gens[i]].y,cities[population[0].gens[i+1]].x,cities[population[0].gens[i+1]].y)
	}
}
//mutation
function mutations(c){
	for(i=0;i<c;i++){
		mutation()
	}
}
function mutation(){
	let tempData = 0;

	let pNum = floor(random(populationSize))
	let tempPopulation =population[pNum];
	let fNum =floor(random(citySize))
	let sNum =floor(random(citySize))
	while(sNum==fNum)
		sNum =floor(random(citySize))
	let f = population[fNum]
	let s = population[sNum]

	tempData=tempPopulation.gens[fNum]
	tempPopulation.gens[fNum]=tempPopulation.gens[sNum]
	tempPopulation.gens[sNum]=tempData
	tempPopulation.result=fitnessFunc(tempPopulation.gens)
	population.push(tempPopulation);
	population=resultSort(population)
	populationSize++;
}

//Cross
function crosser(c){
	cross(0,2)
	cross(1,3)
	for(var i=2;i<c;i++){
		let fNum =floor(random(populationSize))
		let sNum =floor(random(populationSize))
		while(sNum==fNum)
			sNum =floor(random(populationSize))
		cross(fNum,sNum)
	}

	population = resultSort(population)
}
function cross(f,s){
	let haveVal0=[];
	let tempGen = new genetic();

	for (var i=0;i<(citySize/2);i++){
		haveVal0.push(population[f].gens[i])
		tempGen.gens.push(population[f].gens[i])
	}
	for(var i=0;i<citySize;i++){
		let status = 0;
		for (var j=0;j<(citySize/2);j++){
			if(haveVal0[j]==population[s].gens[i])
				status=1
		}
		if(status==0){
			tempGen.gens.push(population[s].gens[i])
		}
	}
	tempGen.result=fitnessFunc(tempGen.gens);
	population.push(tempGen)
	populationSize++;	
}

//Objects
function genetic(){
	this.gens=[]
	this.result =0;
}
function city(){
	this.x =0;
	this.y =0;
}