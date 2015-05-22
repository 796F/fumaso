const Curves = FamousPlatform.transitions.Curves;
const FamousEngine = FamousPlatform.core.FamousEngine;
const Transitionable = FamousPlatform.transitions.Transitionable;

export default class Timeline {
  constructor(options = {}) {
    this.pathSet = [];
    this.timescale = options.timescale || 1;
    this.currentTime = new Transitionable(0);
    this.endTime = 0;
  }

  /*
        pathData = {
          handler : function(value) {
            console.log(value);
          },
          path : [
            [0, [0, 0, 0]],
            [5000, [100, 100, 100]]
          ]
        }
  */

  registerPath(pathData) {
    this.pathSet.push(pathData);
    for(let i=0; i<pathData.length; i++){
      if(pathData[i][0] > this.endTime) this.endTime = pathData[i][0];
    }
  }

  play() {
    this.set(this.endTime, { duration : this.endTime - this.currentTime.get() });
  }

  set(time, transition, callback) {
    if (transition) {
      this.inTransition = true;
      FamousEngine.requestUpdateOnNextTick(this);
      this.currentTime.set(time, transition, () => {
        this.inTransition = false;
        FamousEngine.requestUpdateOnNextTick(this);
        if (callback) {
          callback();
        }
      });
    } else {
      this.currentTime.set(time);
      this.inTransition = false;
      FamousEngine.requestUpdateOnNextTick(this);
    }
  }

  onUpdate(time) {
    // go through the pathSet, and basically execute the function

    time = this.currentTime.get() * this.timescale;

    for (let i = 0; i < this.pathSet.length; i++) {
      let pathData = this.pathSet[i];

      for (let j = 0; j < pathData.path.length; j++) {
        let res = [];
        let currStep = pathData.path[j];
        let nextStep = pathData.path[j + 1];

        // currently mid path, calculate and apply.
        if (nextStep && currStep[0] <= time && nextStep[0] >= time) {
          let percentDone = (time - currStep[0]) / (nextStep[0] - currStep[0]);
          let state = currStep[2] ? currStep[2](percentDone) : Curves.linear(percentDone);

          if (currStep[1] instanceof Array) {
            for (let k = 0; k < currStep[1].length; k++) {
              res[k] = currStep[1][k] + (nextStep[1][k] - currStep[1][k]) * state;
            }
          } else {
            res = currStep[1] + (nextStep[1] - currStep[1]) * state;
          }
          pathData.handler(res);
        }

        // we are passed last step, set object to final state.
        if (!nextStep && currStep[0] < time) {
          pathData.handler(currStep[1]);
        }
      }
    }

    if (this.inTransition) {
      FamousEngine.requestUpdateOnNextTick(this);
    }
  }
}
