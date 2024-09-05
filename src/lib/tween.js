!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).TWEEN={})}(this,function(t){"use strict";var e,i=Object.freeze({Linear:Object.freeze({None:function(t){return t},In:function(t){return this.None(t)},Out:function(t){return this.None(t)},InOut:function(t){return this.None(t)}}),Quadratic:Object.freeze({In:function(t){return t*t},Out:function(t){return t*(2-t)},InOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}}),Cubic:Object.freeze({In:function(t){return t*t*t},Out:function(t){return--t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}}),Quartic:Object.freeze({In:function(t){return t*t*t*t},Out:function(t){return 1- --t*t*t*t},InOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}}),Quintic:Object.freeze({In:function(t){return t*t*t*t*t},Out:function(t){return--t*t*t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}}),Sinusoidal:Object.freeze({In:function(t){return 1-Math.sin((1-t)*Math.PI/2)},Out:function(t){return Math.sin(t*Math.PI/2)},InOut:function(t){return .5*(1-Math.sin(Math.PI*(.5-t)))}}),Exponential:Object.freeze({In:function(t){return 0===t?0:Math.pow(1024,t-1)},Out:function(t){return 1===t?1:1-Math.pow(2,-10*t)},InOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)}}),Circular:Object.freeze({In:function(t){return 1-Math.sqrt(1-t*t)},Out:function(t){return Math.sqrt(1- --t*t)},InOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)}}),Elastic:Object.freeze({In:function(t){return 0===t?0:1===t?1:-Math.pow(2,10*(t-1))*Math.sin((t-1.1)*5*Math.PI)},Out:function(t){return 0===t?0:1===t?1:Math.pow(2,-10*t)*Math.sin((t-.1)*5*Math.PI)+1},InOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?-.5*Math.pow(2,10*(t-1))*Math.sin((t-1.1)*5*Math.PI):.5*Math.pow(2,-10*(t-1))*Math.sin((t-1.1)*5*Math.PI)+1}}),Back:Object.freeze({In:function(t){return 1===t?1:t*t*(2.70158*t-1.70158)},Out:function(t){return 0===t?0:--t*t*(2.70158*t+1.70158)+1},InOut:function(t){return(t*=2)<1?.5*(t*t*(3.5949095*t-2.5949095)):.5*((t-=2)*t*(3.5949095*t+2.5949095)+2)}}),Bounce:Object.freeze({In:function(t){return 1-i.Bounce.Out(1-t)},Out:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},InOut:function(t){return t<.5?.5*i.Bounce.In(2*t):.5*i.Bounce.Out(2*t-1)+.5}}),generatePow:function(t){return void 0===t&&(t=4),t=(t=t<Number.EPSILON?Number.EPSILON:t)>1e4?1e4:t,{In:function(e){return Math.pow(e,t)},Out:function(e){return 1-Math.pow(1-e,t)},InOut:function(e){return e<.5?Math.pow(2*e,t)/2:(1-Math.pow(2-2*e,t))/2+.5}}}}),n=function(){return performance.now()},r=function(){function t(){this._tweens={},this._tweensAddedDuringUpdate={}}return t.prototype.getAll=function(){var t=this;return Object.keys(this._tweens).map(function(e){return t._tweens[e]})},t.prototype.removeAll=function(){this._tweens={}},t.prototype.add=function(t){this._tweens[t.getId()]=t,this._tweensAddedDuringUpdate[t.getId()]=t},t.prototype.remove=function(t){delete this._tweens[t.getId()],delete this._tweensAddedDuringUpdate[t.getId()]},t.prototype.update=function(t,e){void 0===t&&(t=n()),void 0===e&&(e=!1);var i=Object.keys(this._tweens);if(0===i.length)return!1;for(;i.length>0;){this._tweensAddedDuringUpdate={};for(var r=0;r<i.length;r++){var s=this._tweens[i[r]],o=!e;s&&!1===s.update(t,o)&&!e&&delete this._tweens[i[r]]}i=Object.keys(this._tweensAddedDuringUpdate)}return!0},t}(),s={Linear:function(t,e){var i=t.length-1,n=i*e,r=Math.floor(n),o=s.Utils.Linear;return e<0?o(t[0],t[1],n):e>1?o(t[i],t[i-1],i-n):o(t[r],t[r+1>i?i:r+1],n-r)},Bezier:function(t,e){for(var i=0,n=t.length-1,r=Math.pow,o=s.Utils.Bernstein,a=0;a<=n;a++)i+=r(1-e,n-a)*r(e,a)*t[a]*o(n,a);return i},CatmullRom:function(t,e){var i=t.length-1,n=i*e,r=Math.floor(n),o=s.Utils.CatmullRom;return t[0]===t[i]?(e<0&&(r=Math.floor(n=i*(1+e))),o(t[(r-1+i)%i],t[r],t[(r+1)%i],t[(r+2)%i],n-r)):e<0?t[0]-(o(t[0],t[0],t[1],t[1],-n)-t[0]):e>1?t[i]-(o(t[i],t[i],t[i-1],t[i-1],n-i)-t[i]):o(t[r?r-1:0],t[r],t[i<r+1?i:r+1],t[i<r+2?i:r+2],n-r)},Utils:{Linear:function(t,e,i){return(e-t)*i+t},Bernstein:function(t,e){var i=s.Utils.Factorial;return i(t)/i(e)/i(t-e)},Factorial:(e=[1],function(t){var i=1;if(e[t])return e[t];for(var n=t;n>1;n--)i*=n;return e[t]=i,i}),CatmullRom:function(t,e,i,n,r){var s=(i-t)*.5,o=(n-e)*.5,a=r*r;return(2*e-2*i+s+o)*(r*a)+(-3*e+3*i-2*s-o)*a+s*r+e}}},o=function(){function t(){}return t.nextId=function(){return t._nextId++},t._nextId=0,t}(),a=new r,u=function(){function t(t,e){void 0===e&&(e=a),this._object=t,this._group=e,this._isPaused=!1,this._pauseStart=0,this._valuesStart={},this._valuesEnd={},this._valuesStartRepeat={},this._duration=1e3,this._isDynamic=!1,this._initialRepeat=0,this._repeat=0,this._yoyo=!1,this._isPlaying=!1,this._reversed=!1,this._delayTime=0,this._startTime=0,this._easingFunction=i.Linear.None,this._interpolationFunction=s.Linear,this._chainedTweens=[],this._onStartCallbackFired=!1,this._onEveryStartCallbackFired=!1,this._id=o.nextId(),this._isChainStopped=!1,this._propertiesAreSetUp=!1,this._goToEnd=!1}return t.prototype.getId=function(){return this._id},t.prototype.isPlaying=function(){return this._isPlaying},t.prototype.isPaused=function(){return this._isPaused},t.prototype.to=function(t,e){if(void 0===e&&(e=1e3),this._isPlaying)throw Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");return this._valuesEnd=t,this._propertiesAreSetUp=!1,this._duration=e,this},t.prototype.duration=function(t){return void 0===t&&(t=1e3),this._duration=t,this},t.prototype.dynamic=function(t){return void 0===t&&(t=!1),this._isDynamic=t,this},t.prototype.start=function(t,e){if(void 0===t&&(t=n()),void 0===e&&(e=!1),this._isPlaying)return this;if(this._group&&this._group.add(this),this._repeat=this._initialRepeat,this._reversed)for(var i in this._reversed=!1,this._valuesStartRepeat)this._swapEndStartRepeatValues(i),this._valuesStart[i]=this._valuesStartRepeat[i];if(this._isPlaying=!0,this._isPaused=!1,this._onStartCallbackFired=!1,this._onEveryStartCallbackFired=!1,this._isChainStopped=!1,this._startTime=t,this._startTime+=this._delayTime,!this._propertiesAreSetUp||e){if(this._propertiesAreSetUp=!0,!this._isDynamic){var r={};for(var s in this._valuesEnd)r[s]=this._valuesEnd[s];this._valuesEnd=r}this._setupProperties(this._object,this._valuesStart,this._valuesEnd,this._valuesStartRepeat,e)}return this},t.prototype.startFromCurrentValues=function(t){return this.start(t,!0)},t.prototype._setupProperties=function(t,e,i,n,r){for(var s in i){var o=t[s],a=Array.isArray(o),u=a?"array":typeof o,h=!a&&Array.isArray(i[s]);if("undefined"!==u&&"function"!==u){if(h){var p=i[s];if(0===p.length)continue;for(var l=[o],d=0,c=p.length;d<c;d+=1){var f=this._handleRelativeValue(o,p[d]);if(isNaN(f)){h=!1,console.warn("Found invalid interpolation list. Skipping.");break}l.push(f)}h&&(i[s]=l)}if(("object"===u||a)&&o&&!h){e[s]=a?[]:{};var $=o;for(var _ in $)e[s][_]=$[_];n[s]=a?[]:{};var p=i[s];if(!this._isDynamic){var v={};for(var _ in p)v[_]=p[_];i[s]=p=v}this._setupProperties($,e[s],p,n[s],r)}else(void 0===e[s]||r)&&(e[s]=o),a||(e[s]*=1),h?n[s]=i[s].slice().reverse():n[s]=e[s]||0}}},t.prototype.stop=function(){return this._isChainStopped||(this._isChainStopped=!0,this.stopChainedTweens()),this._isPlaying&&(this._group&&this._group.remove(this),this._isPlaying=!1,this._isPaused=!1,this._onStopCallback&&this._onStopCallback(this._object)),this},t.prototype.end=function(){return this._goToEnd=!0,this.update(1/0),this},t.prototype.pause=function(t){return void 0===t&&(t=n()),this._isPaused||!this._isPlaying||(this._isPaused=!0,this._pauseStart=t,this._group&&this._group.remove(this)),this},t.prototype.resume=function(t){return void 0===t&&(t=n()),this._isPaused&&this._isPlaying&&(this._isPaused=!1,this._startTime+=t-this._pauseStart,this._pauseStart=0,this._group&&this._group.add(this)),this},t.prototype.stopChainedTweens=function(){for(var t=0,e=this._chainedTweens.length;t<e;t++)this._chainedTweens[t].stop();return this},t.prototype.group=function(t){return void 0===t&&(t=a),this._group=t,this},t.prototype.delay=function(t){return void 0===t&&(t=0),this._delayTime=t,this},t.prototype.repeat=function(t){return void 0===t&&(t=0),this._initialRepeat=t,this._repeat=t,this},t.prototype.repeatDelay=function(t){return this._repeatDelayTime=t,this},t.prototype.yoyo=function(t){return void 0===t&&(t=!1),this._yoyo=t,this},t.prototype.easing=function(t){return void 0===t&&(t=i.Linear.None),this._easingFunction=t,this},t.prototype.interpolation=function(t){return void 0===t&&(t=s.Linear),this._interpolationFunction=t,this},t.prototype.chain=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return this._chainedTweens=t,this},t.prototype.onStart=function(t){return this._onStartCallback=t,this},t.prototype.onEveryStart=function(t){return this._onEveryStartCallback=t,this},t.prototype.onUpdate=function(t){return this._onUpdateCallback=t,this},t.prototype.onRepeat=function(t){return this._onRepeatCallback=t,this},t.prototype.onComplete=function(t){return this._onCompleteCallback=t,this},t.prototype.onStop=function(t){return this._onStopCallback=t,this},t.prototype.update=function(t,e){if(void 0===t&&(t=n()),void 0===e&&(e=!0),this._isPaused)return!0;var i,r,s=this._startTime+this._duration;if(!this._goToEnd&&!this._isPlaying){if(t>s)return!1;e&&this.start(t,!0)}if(this._goToEnd=!1,t<this._startTime)return!0;!1===this._onStartCallbackFired&&(this._onStartCallback&&this._onStartCallback(this._object),this._onStartCallbackFired=!0),!1===this._onEveryStartCallbackFired&&(this._onEveryStartCallback&&this._onEveryStartCallback(this._object),this._onEveryStartCallbackFired=!0),r=(t-this._startTime)/this._duration,r=0===this._duration||r>1?1:r;var o=this._easingFunction(r);if(this._updateProperties(this._object,this._valuesStart,this._valuesEnd,o),this._onUpdateCallback&&this._onUpdateCallback(this._object,r),1===r){if(this._repeat>0){for(i in isFinite(this._repeat)&&this._repeat--,this._valuesStartRepeat)this._yoyo||"string"!=typeof this._valuesEnd[i]||(this._valuesStartRepeat[i]=this._valuesStartRepeat[i]+parseFloat(this._valuesEnd[i])),this._yoyo&&this._swapEndStartRepeatValues(i),this._valuesStart[i]=this._valuesStartRepeat[i];this._yoyo&&(this._reversed=!this._reversed),void 0!==this._repeatDelayTime?this._startTime=t+this._repeatDelayTime:this._startTime=t+this._delayTime,this._onRepeatCallback&&this._onRepeatCallback(this._object),this._onEveryStartCallbackFired=!1}else{this._onCompleteCallback&&this._onCompleteCallback(this._object);for(var a=0,u=this._chainedTweens.length;a<u;a++)this._chainedTweens[a].start(this._startTime+this._duration,!1);return this._isPlaying=!1,!1}}return!0},t.prototype._updateProperties=function(t,e,i,n){for(var r in i)if(void 0!==e[r]){var s=e[r]||0,o=i[r],a=Array.isArray(t[r]),u=Array.isArray(o);!a&&u?t[r]=this._interpolationFunction(o,n):"object"==typeof o&&o?this._updateProperties(t[r],s,o,n):"number"==typeof(o=this._handleRelativeValue(s,o))&&(t[r]=s+(o-s)*n)}},t.prototype._handleRelativeValue=function(t,e){return"string"!=typeof e?e:"+"===e.charAt(0)||"-"===e.charAt(0)?t+parseFloat(e):parseFloat(e)},t.prototype._swapEndStartRepeatValues=function(t){var e=this._valuesStartRepeat[t],i=this._valuesEnd[t];"string"==typeof i?this._valuesStartRepeat[t]=this._valuesStartRepeat[t]+parseFloat(i):this._valuesStartRepeat[t]=this._valuesEnd[t],this._valuesEnd[t]=e},t}(),h="21.0.0",p=o.nextId,l=a,d=l.getAll.bind(l),c=l.removeAll.bind(l),f=l.add.bind(l),$=l.remove.bind(l),_=l.update.bind(l);t.Easing=i,t.Group=r,t.Interpolation=s,t.Sequence=o,t.Tween=u,t.VERSION=h,t.add=f,t.default={Easing:i,Group:r,Interpolation:s,now:n,Sequence:o,nextId:p,Tween:u,VERSION:h,getAll:d,removeAll:c,add:f,remove:$,update:_},t.getAll=d,t.nextId=p,t.now=n,t.remove=$,t.removeAll=c,t.update=_,Object.defineProperty(t,"__esModule",{value:!0});window.TWEEN = t;});