// GeneForge v1 - Genetic Programming: evolves math from data
// Breeds JavaScript expression trees through Darwinian evolution
// to perform symbolic regression without calculus.
function V(n){this.t='v';this.n=n}
V.prototype={eval:function(e){return e[this.n]||0},
str:function(){return this.n},clone:function(){return new V(this.n)},sz:function(){return 1}};
function N(v){this.t='n';this.v=v}
N.prototype={eval:function(){return this.v},
str:function(){return Number(this.v.toFixed(3))+''},clone:function(){return new N(this.v)},sz:function(){return 1}};
function B(o,l,r){this.t='b';this.o=o;this.l=l;this.r=r}
var OP={'+':function(a,b){return a+b},'-':function(a,b){return a-b},
'*':function(a,b){return a*b},'/':function(a,b){return Math.abs(b)<1e-3?1:a/b},
'^':function(a,b){var r=Math.pow(a,Math.min(Math.max(b,-10),10));return isFinite(r)?r:0}};
B.prototype={eval:function(e){var a=this.l.eval(e),b=this.r.eval(e),r=OP[this.o](a,b);return isFinite(r)?r:0},
str:function(){return'('+this.l.str()+this.o+this.r.str()+')'},
clone:function(){return new B(this.o,this.l.clone(),this.r.clone())},
sz:function(){return 1+this.l.sz()+this.r.sz()}};
function U(f,c){this.t='u';this.f=f;this.c=c}
var UF={S:Math.sin,C:Math.cos,A:Math.abs,Q:function(x){return Math.sqrt(Math.abs(x))}};
U.prototype={eval:function(e){var v=this.c.eval(e),r=UF[this.f](v);return isFinite(r)?r:0},
str:function(){var n={S:'sin',C:'cos',A:'abs',Q:'sqrt'};return(n[this.f]||this.f)+'('+this.c.str()+')'},
clone:function(){return new U(this.f,this.c.clone())},
sz:function(){return 1+this.c.sz()}};
function seed(s){return function(){s=(s+0x6D2B79F5)|0;var t=Math.imul(s^(s>>>15),1|s);
t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
var R=seed(42),RI=function(n){return Math.floor(R()*n)},pk=function(a){return a[RI(a.length)]};
var CN=[0,1,2,3,-1,.5,Math.PI],BO=['+','-','*','/','^'],UO=['S','C','A','Q'];
function rnd(v,m,d){d=d||0;
if(d>=m)return R()<.6&&v.length?new V(pk(v)):new N(R()<.7?pk(CN):R()*10-5);
var p=.3+(d/m)*.3,r=R();
if(r<p)return R()<.6&&v.length?new V(pk(v)):new N(R()<.7?pk(CN):R()*10-5);
if(r<p+.15)return new U(pk(UO),rnd(v,m,d+1));
return new B(pk(BO),rnd(v,m,d+1),rnd(v,m,d+1))}
function nodes(t){var ns=[{n:t,p:null,f:null}],s=[ns[0]];
while(s.length){var c=s.pop(),nd=c.n;
if(nd.t==='b'){var le={n:nd.l,p:nd,f:'l'},ri={n:nd.r,p:nd,f:'r'};ns.push(le,ri);s.push(le,ri)}
else if(nd.t==='u'){var ce={n:nd.c,p:nd,f:'c'};ns.push(ce);s.push(ce)}}
return ns}
function crossover(a,b){var c1=a.clone(),c2=b.clone(),n1=nodes(c1),n2=nodes(c2);
var s1=n1[RI(n1.length)],s2=n2[RI(n2.length)];
if(s1.p&&s2.p){var t=s1.n.clone();s1.p[s1.f]=s2.n.clone();s2.p[s2.f]=t}
else if(s1.p)s1.p[s1.f]=s2.n.clone();
return[c1,c2]}
function mutate(t,v,m){var c=t.clone(),ns=nodes(c);
if(ns.length<=1)return rnd(v,3);
var i=1+RI(ns.length-1),g=ns[i];if(g.p)g.p[g.f]=rnd(v,3,0);return c}
function fitness(tree,data,tgt,vars){var te=0;
for(var i=0;i<data.length;i++){var e={};
for(var j=0;j<vars.length;j++)e[vars[j]]=data[i][vars[j]];
var err=tree.eval(e)-data[i][tgt];te+=err*err}
var mse=te/data.length,sz=tree.sz();return 1/(1+mse)-(sz>20?(sz-20)*.002:0)}
function tsel(pop,f,k){k=k||5;var bi=RI(pop.length),bf=f[bi];
for(var i=1;i<k;i++){var x=RI(pop.length);if(f[x]>bf){bi=x;bf=f[x]}}return pop[bi]}

function GeneForge(o){o=o||{};this.ps=o.populationSize||150;this.md=o.maxDepth||5;
this.cx=o.crossoverRate||.7;this.mu=o.mutationRate||.25;this.el=o.eliteCount||2;
this.ts=o.tournamentSize||5;if(o.seed!=null)R=seed(o.seed)}

GeneForge.prototype.evolve=function(data,tgt,vars,gens){
gens=gens||50;var pop=[];
for(var i=0;i<this.ps;i++)pop.push(rnd(vars,2+RI(this.md-1)));
var be=null,bf=-1/0,hist=[];
for(var g=0;g<gens;g++){
var z=1;module.exports={z:z};