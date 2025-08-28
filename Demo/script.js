// script.js – Demo tecniche per la tesi Pyragogy
document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // Ecosystem Health Monitor
  // =====================
  const ecoCtx = document.getElementById('ecosystemChart');
  if (ecoCtx) {
    new Chart(ecoCtx, {
      type: 'bar',
      data: {
        labels: ['Idea A','Idea B','Idea C','Idea D','Idea E'],
        datasets: [{
          label: 'Salute idee (0-10)',
          data: [6.4, 7.8, 5.1, 8.0, 6.9],
          backgroundColor: ['#2E7D32','#388E3C','#45A049','#66BB6A','#81C784'],
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false }},
        scales: { y: { beginAtZero: true, max: 10 }}
      }
    });
  }

  // =====================
  // Idea Evolution Simulator
  // =====================
  const svg = document.getElementById('ideasSvg');
  const addBtn = document.getElementById('addIdea');
  const resetBtn = document.getElementById('resetSim');
  const mutationRateInput = document.getElementById('mutationRate');
  const selectionPressureInput = document.getElementById('selectionPressure');

  let ideas = [];
  function rand(min,max){ return Math.random()*(max-min)+min; }

  function createIdea(x=null) {
    const id = Date.now().toString(36) + Math.floor(Math.random()*1000);
    const quality = +(rand(2,9)).toFixed(2);
    const novelty = +(rand(0,1)).toFixed(2);
    const cx = x ?? rand(40, svg.clientWidth-40);
    const cy = rand(40, svg.clientHeight-40);
    ideas.push({ id, quality, novelty, age:0, cx, cy });
    renderIdeas();
  }

  function renderIdeas() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    ideas.forEach(node=>{
      const r = Math.max(6, Math.min(32,node.quality*3));
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',node.cx);
      circle.setAttribute('cy',node.cy);
      circle.setAttribute('r',r);
      circle.setAttribute('fill','rgba(46,125,50,0.8)');
      circle.setAttribute('stroke','#fff');
      circle.setAttribute('stroke-width','1');
      svg.appendChild(circle);

      const text = document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('x',node.cx);
      text.setAttribute('y',node.cy+r+12);
      text.setAttribute('text-anchor','middle');
      text.setAttribute('font-size','11');
      text.textContent=`${node.quality.toFixed(1)}q • ${node.novelty.toFixed(2)}n`;
      svg.appendChild(text);

      // doppio click = mutazione
      circle.addEventListener('dblclick',()=>{
        node.quality=Math.max(0,Math.min(10,node.quality+rand(-1.5,1.5)));
        node.novelty=Math.max(0,Math.min(1,node.novelty+rand(-0.15,0.15)));
        renderIdeas();
      });
    });

    document.getElementById('metric-active').textContent=ideas.length;
    document.getElementById('metric-evolving').textContent=ideas.filter(i=>i.age<6).length;
  }

  function tick() {
    const mutationRate=parseFloat(mutationRateInput?.value||0.15);
    const selectionPressure=parseFloat(selectionPressureInput?.value||1);

    ideas.forEach(i=>{
      i.age+=1;
      if(Math.random()<mutationRate){
        i.quality=Math.max(0,Math.min(10,i.quality+rand(-1,1)));
        i.novelty=Math.max(0,Math.min(1,i.novelty+rand(-0.1,0.1)));
      }
    });

    if(ideas.length>1 && Math.random()<0.02*selectionPressure){
      const avg=ideas.reduce((s,x)=>s+x.quality,0)/ideas.length;
      ideas.sort((a,b)=>a.quality-b.quality);
      if(ideas[0].quality<avg) ideas.shift();
    }

    renderIdeas();
  }

  addBtn?.addEventListener('click',()=>createIdea());
  resetBtn?.addEventListener('click',()=>{ideas=[];renderIdeas();});
  svg?.addEventListener('click',(e)=>{
    const rect=svg.getBoundingClientRect();
    createIdea(e.clientX-rect.left);
  });

  for(let i=0;i<5;i++) createIdea();
  setInterval(tick,1500);

  // =====================
  // Collaborative Feedback Loop
  // =====================
  const feedbackCtx = document.getElementById('feedbackChart');
  if (feedbackCtx) {
    new Chart(feedbackCtx, {
      type: 'line',
      data: {
        labels: ['Round 1','Round 2','Round 3','Round 4'],
        datasets: [{
          label: 'Qualità media',
          data: [5.2,6.1,7.0,7.5],
          borderColor: '#2E7D32',
          backgroundColor: '#2E7D32',
          tension:0.3
        }]
      },
      options:{scales:{y:{min:0,max:10}}}
    });
  }

  // =====================
  // AI–Human Rhythm Analyzer
  // =====================
  const rhythmCtx = document.getElementById('rhythmChart');
  if (rhythmCtx) {
    new Chart(rhythmCtx, {
      type:'line',
      data:{
        labels:Array.from({length:20},(_,i)=>i+1),
        datasets:[
          {label:'Umano',data:Array.from({length:20},()=>Math.random()*2),
           borderColor:'#2E7D32',fill:false,tension:0.4},
          {label:'AI',data:Array.from({length:20},()=>Math.random()*2),
           borderColor:'#388E3C',fill:false,tension:0.4}
        ]
      },
      options:{scales:{y:{min:0,max:2}}}
    });
  }

  // =====================
  // Diversity vs Selection Trade-off
  // =====================
  const diversityCtx=document.getElementById('diversityChart');
  if(diversityCtx){
    new Chart(diversityCtx,{
      type:'scatter',
      data:{
        datasets:[{
          label:'Diversità vs Selezione',
          data:Array.from({length:12},()=>({x:Math.random()*2,y:Math.random()*10})),
          backgroundColor:'#45A049'
        }]
      },
      options:{
        scales:{
          x:{title:{display:true,text:'Selection Pressure'}},
          y:{title:{display:true,text:'Diversity'}}
        }
      }
    });
  }
});
